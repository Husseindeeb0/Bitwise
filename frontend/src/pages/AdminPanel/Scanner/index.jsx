import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import {
  FaQrcode,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSync,
} from 'react-icons/fa';
import { validateTicket } from '../../../features/ticket/ticketThunks';
import { getAnnouncementById } from '../../../features/announcements/announcementsThunks';
import toast from 'react-hot-toast';

const Scanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [announcement, setAnnouncement] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const html5QrCodeRef = useRef(null);
  const isProcessing = useRef(false);

  // 1. Fetch Event Details
  useEffect(() => {
    if (id) {
      dispatch(getAnnouncementById(id))
        .unwrap()
        .then(setAnnouncement)
        .catch(() => toast.error('Failed to load event details'));
    }
  }, [id, dispatch]);

  // 2. Start Scanner only when needed
  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      // Small delay to ensure the DOM element #reader is mounted by Framer Motion
      await new Promise((r) => setTimeout(r, 300));
      if (!mounted || result || loading || isInitializing) return;

      const readerElement = document.getElementById('reader');
      if (!readerElement) return;

      try {
        setIsInitializing(true);
        const scanner = new Html5Qrcode('reader');
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 15, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
          onScanSuccess
        );
      } catch (err) {
        console.error('Scanner Start Error:', err);
      } finally {
        if (mounted) setIsInitializing(false);
      }
    };

    if (!result && !loading) {
      startScanner();
    }

    return () => {
      mounted = false;
      if (html5QrCodeRef.current) {
        // Use a generic catch to ignore "re-entry" or "media removal" errors during cleanup
        html5QrCodeRef.current
          .stop()
          .then(() => {
            const el = document.getElementById('reader');
            if (el) el.innerHTML = '';
          })
          .catch(() => {})
          .finally(() => {
            html5QrCodeRef.current = null;
          });
      }
    };
  }, [result, loading]);

  const onScanSuccess = async (decodedText) => {
    if (isProcessing.current || result || loading) return;
    isProcessing.current = true;
    setLoading(true);

    try {
      // 1. Stop scanner before network request
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop().catch(() => {});
        const el = document.getElementById('reader');
        if (el) el.innerHTML = '';
        html5QrCodeRef.current = null;
      }

      // 2. Validate
      const resp = await dispatch(
        validateTicket({
          token: decodedText,
          announcementId: id,
        })
      ).unwrap();

      setResult(resp);
    } catch (err) {
      setResult(err || { status: 'error', message: 'Validation failed' });
    } finally {
      setLoading(false);
      isProcessing.current = false;
    }
  };

  const resetScanner = () => {
    setResult(null);
    setLoading(false);
    isProcessing.current = false;
  };

  return (
    <div className="min-h-screen bg-navy-blue flex flex-col pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/manageAnnouncements')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group px-4 py-2 bg-white/5 rounded-xl border border-white/10"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Exit
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-white tracking-tight">
              VALIDATOR
            </h1>
            <p className="text-sky-400 text-[10px] font-black uppercase tracking-widest truncate max-w-[150px]">
              {announcement?.title || 'PENDING...'}
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="scanner-area"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative aspect-square w-full max-w-sm mx-auto bg-black rounded-[4rem] overflow-hidden border-8 border-white/5 shadow-2xl"
              >
                <div id="reader" className="w-full h-full"></div>

                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-48 h-48 border-2 border-sky-400/30 rounded-[2rem] relative">
                    <motion.div
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute left-0 right-0 h-0.5 bg-sky-400 shadow-[0_0_15px_#38bdf8]"
                    />
                  </div>
                  <p className="mt-10 text-sky-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
                    {isInitializing ? 'Syncing Camera...' : 'Ready to Scan'}
                  </p>
                </div>

                {loading && (
                  <div className="absolute inset-0 bg-navy-blue/90 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-sky-400/20 border-t-sky-400 rounded-full animate-spin" />
                      <p className="text-white font-black text-xs uppercase tracking-widest">
                        Verifying...
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result-area"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm mx-auto bg-white rounded-[4rem] overflow-hidden shadow-2xl"
              >
                <div
                  className={`p-10 text-center ${
                    result.status === 'success'
                      ? 'bg-emerald-500'
                      : result.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                  }`}
                >
                  <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-4xl mb-4">
                    {result.status === 'success' && <FaCheckCircle />}
                    {result.status === 'warning' && <FaExclamationTriangle />}
                    {result.status === 'error' && <FaTimesCircle />}
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    {result.status}
                  </h2>
                  <p className="text-white/90 font-bold text-sm mt-1">
                    {result.message}
                  </p>
                </div>

                <div className="p-8 space-y-6">
                  {result.user && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                      <img
                        src={
                          result.user.profileImage?.url ||
                          'https://via.placeholder.com/150'
                        }
                        className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                        alt="p"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-navy-blue truncate">
                          {result.user.username}
                        </h3>
                        <p className="text-slate-400 font-bold text-[10px] uppercase truncate">
                          {result.user.email}
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={resetScanner}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-navy-blue text-white rounded-[2rem] font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-navy-blue/20"
                  >
                    <FaSync />
                    NEXT SCAN
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center text-white/10 uppercase font-black text-[10px] tracking-[0.4em]">
          Bitwise Security Node
        </div>
      </div>
    </div>
  );
};

export default Scanner;
