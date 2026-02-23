import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Order } from '../types';

export const generateInvoice = (order: Order) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('VEMGAL MART', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Invoice for Order: ' + order.id, 14, 28);
    doc.text('Date: ' + new Date(order.createdAt).toLocaleDateString(), 14, 34);

    // Customer Info
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('Bill To:', 14, 45);
    doc.setFontSize(10);
    doc.text(order.customerName, 14, 52);
    // Split the address string into multiple lines so it doesn't overflow
    const splitAddress = doc.splitTextToSize(order.deliveryAddress, 100);
    doc.text(splitAddress, 14, 58);

    // Table
    const tableData = order.items.map(item => [
        item.name,
        item.quantity.toString(),
        `Rs. ${item.price.toFixed(2)}`,
        `Rs. ${(item.price * item.quantity).toFixed(2)}`
    ]);

    autoTable(doc, {
        startY: Math.max(70, 58 + (splitAddress.length * 5) + 5),
        head: [['Product', 'Quantity', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [124, 58, 237] }, // Primary color
        styles: { fontSize: 10, cellPadding: 5 }
    });

    // Total
    // @ts-ignore - jspdf-autotable adds lastAutoTable to the doc
    const finalY = doc.lastAutoTable.finalY || 70;
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`Total Amount: Rs. ${order.total.toFixed(2)}`, 140, finalY + 15);

    doc.save(`Invoice_${order.id}.pdf`);
};
