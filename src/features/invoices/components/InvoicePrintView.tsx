import React from 'react';
import type { Invoice } from '../types/invoice.types';
import { COMPANY_NAME } from '@/lib/constants';

interface InvoicePrintViewProps {
  invoice: Invoice;
}

export const InvoicePrintView: React.FC<InvoicePrintViewProps> = ({ invoice }) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="print-invoice bg-white p-8 max-w-4xl mx-auto" id="invoice-print">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-primary-500">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img src="/favicon.svg" alt="Logo" className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold text-primary-600">{COMPANY_NAME}</h1>
              <p className="text-sm text-neutral-500">Business Management System</p>
            </div>
          </div>
          <p className="text-sm text-neutral-600 mt-4">
            123 Scent Avenue<br />
            Washington, DC 20001<br />
            (202) 555-0100<br />
            info@superiorscents.com
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">INVOICE</h2>
          <p className="text-lg font-semibold text-primary-600">{invoice.invoiceNumber}</p>
          <div className="mt-4 text-sm text-neutral-600">
            <p><span className="font-medium">Issue Date:</span> {formatDate(invoice.issueDate)}</p>
            <p><span className="font-medium">Due Date:</span> {formatDate(invoice.dueDate)}</p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-2">Bill To</h3>
        <p className="font-semibold text-neutral-800 text-lg">{invoice.customerName}</p>
        <p className="text-neutral-600">{invoice.customerAddress}</p>
        <p className="text-neutral-600">{invoice.customerEmail}</p>
        <p className="text-neutral-600">{invoice.customerPhone}</p>
      </div>

      {/* Line Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="bg-neutral-100">
            <th className="text-left py-3 px-4 font-semibold text-neutral-700">Description</th>
            <th className="text-center py-3 px-4 font-semibold text-neutral-700">Type</th>
            <th className="text-right py-3 px-4 font-semibold text-neutral-700">Qty</th>
            <th className="text-right py-3 px-4 font-semibold text-neutral-700">Unit Price</th>
            <th className="text-right py-3 px-4 font-semibold text-neutral-700">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
              <td className="py-3 px-4 text-neutral-800">{item.description}</td>
              <td className="py-3 px-4 text-center text-neutral-600 capitalize">{item.type}</td>
              <td className="py-3 px-4 text-right text-neutral-800">{item.quantity}</td>
              <td className="py-3 px-4 text-right text-neutral-800">{formatCurrency(item.unitPrice)}</td>
              <td className="py-3 px-4 text-right font-medium text-neutral-800">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-72">
          <div className="flex justify-between py-2 border-b border-neutral-200">
            <span className="text-neutral-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-200">
            <span className="text-neutral-600">Tax ({invoice.taxRate}%)</span>
            <span>{formatCurrency(invoice.taxAmount)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between py-2 border-b border-neutral-200">
              <span className="text-neutral-600">Discount</span>
              <span className="text-secondary-600">-{formatCurrency(invoice.discount)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 bg-primary-50 px-4 -mx-4 mt-2">
            <span className="text-lg font-bold text-neutral-800">Total</span>
            <span className="text-lg font-bold text-primary-600">{formatCurrency(invoice.total)}</span>
          </div>
          {invoice.amountPaid > 0 && (
            <>
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-600">Amount Paid</span>
                <span className="text-secondary-600">-{formatCurrency(invoice.amountPaid)}</span>
              </div>
              <div className="flex justify-between py-3 bg-warning-50 px-4 -mx-4">
                <span className="font-bold text-neutral-800">Balance Due</span>
                <span className="font-bold text-warning-600">{formatCurrency(invoice.balance)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8 p-4 bg-neutral-50 rounded-lg">
          <h4 className="font-semibold text-neutral-700 mb-2">Notes</h4>
          <p className="text-neutral-600 text-sm">{invoice.notes}</p>
        </div>
      )}

      {/* Terms */}
      {invoice.terms && (
        <div className="mb-8">
          <h4 className="font-semibold text-neutral-700 mb-2">Terms & Conditions</h4>
          <p className="text-neutral-600 text-sm">{invoice.terms}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-8 border-t border-neutral-200">
        <p className="text-neutral-500 text-sm">
          Thank you for your business!
        </p>
        <p className="text-neutral-400 text-xs mt-2">
          {COMPANY_NAME} | (202) 555-0100 | info@superiorscents.com
        </p>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-print, #invoice-print * {
            visibility: visible;
          }
          #invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoicePrintView;
