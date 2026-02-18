const Ticket = require('../models/Ticket');
const BookSubmission = require('../models/BookSubmission');
const Announcement = require('../models/Announcements');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const generateTicketPDF = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const userId = req.userId;

    if (!announcementId) {
      return res.status(400).json({ message: 'Announcement ID is required' });
    }

    // 1. Verify user is registered for this announcement
    const registration = await BookSubmission.findOne({
      userId,
      announcementId,
    })
      .populate('announcementId')
      .populate('userId', 'username email');

    if (!registration) {
      return res
        .status(404)
        .json({ message: 'No registration found for this announcement' });
    }

    const announcement = registration.announcementId;
    const user = registration.userId;

    // 2. Get or Create Ticket record (for the unique token)
    let ticket = await Ticket.findOne({ userId, announcementId });
    if (!ticket) {
      ticket = new Ticket({
        userId,
        announcementId,
        token: uuidv4(), // Unique token for the QR code
      });
      await ticket.save();
    }

    // 3. Generate QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(ticket.token);

    // 4. Create PDF
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=ticket-${announcement.title.replace(/\s+/g, '_')}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // --- PDF Design ---

    // Header / Border
    doc.rect(20, 20, 572, 350).stroke('#3f56a4');

    // Logo (if available, otherwise text)
    // doc.image('path/to/logo.png', 50, 45, { width: 50 });
    doc
      .fillColor('#3f56a4')
      .fontSize(25)
      .font('Helvetica-Bold')
      .text('BITWISE CLUB', 50, 50);
    doc.fontSize(10).font('Helvetica').text('EVENT TICKET', 50, 80);

    doc.moveTo(50, 100).lineTo(562, 100).stroke('#eeeeee');

    // Event Info
    doc
      .fillColor('#333333')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('EVENT DETAILS', 50, 120);
    doc.fontSize(18).text(announcement.title, 50, 140);

    doc.fontSize(12).font('Helvetica');
    const eventDate = new Date(announcement.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(`Date: ${eventDate}`, 50, 170);
    doc.text(`Time: ${announcement.time}`, 50, 190);
    doc.text(`Location: ${announcement.location}`, 50, 210);

    // Attendee Info
    doc.moveTo(50, 240).lineTo(350, 240).stroke('#eeeeee');
    doc
      .fillColor('#3f56a4')
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('ATTENDEE', 50, 260);
    doc.fillColor('#333333').fontSize(14).text(user.username, 50, 280);
    doc.fontSize(10).font('Helvetica').text(user.email, 50, 300);

    // QR Code
    doc.image(qrCodeDataUrl, 380, 110, { width: 180 });
    doc
      .fontSize(8)
      .fillColor('#999999')
      .text(`Ticket ID: ${ticket.token}`, 380, 300, {
        width: 180,
        align: 'center',
      });

    // Footer
    doc
      .fontSize(10)
      .fillColor('#3f56a4')
      .text('Thank you for joining us!', 50, 340);

    // End PDF
    doc.end();
  } catch (error) {
    console.error('Error generating ticket PDF:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate ticket PDF' });
    }
  }
};

module.exports = {
  generateTicketPDF,
};
