import React, { useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../components/ui/card';

export default function SupportTicketCard({ stations = [] }) {
  const stationOptions = useMemo(() => {
    if (!Array.isArray(stations)) return [];
    return stations.map((s) => ({
      value: s.station_id ?? s.id,
      label: s.name ? `${s.name}${s.address ? ` - ${s.address}` : ''}` : `${s.address || 'Unknown station'}`,
    }));
  }, [stations]);

  const categories = [
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing Inquiry' },
    { value: 'feedback', label: 'General Feedback' },
    { value: 'availability', label: 'Station Availability' },
  ];

  const [form, setForm] = useState({ stationId: '', category: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitted(false);
    try {
      // TODO: integrate with backend support endpoint if available
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
      setForm({ stationId: '', category: '', message: '' });
    } catch (err) {
      console.error('Submit support error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="border-b border-gray-100">
        <CardTitle>Submit a Ticket</CardTitle>
        <CardDescription>Our team will review and get back to you shortly.</CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Select Charging Station</span>
              <select
                name="stationId"
                value={form.stationId}
                onChange={onChange}
                className="form-select w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-gray-900 shadow-xs outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Search for a station</option>
                {stationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Select a Category</span>
              <select
                name="category"
                value={form.category}
                onChange={onChange}
                className="form-select w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-gray-900 shadow-xs outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">e.g., Technical Issue, Billing Inquiry</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2 mt-6">
            <span className="text-sm font-medium text-gray-700">Please describe your issue or feedback</span>
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              placeholder="Enter your message here..."
              className="min-h-36 w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 shadow-xs outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </label>

          {submitted && (
            <div className="mt-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800 border border-green-200">
              Thank you! Your feedback has been submitted.
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-end border-t border-gray-100 py-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Feedback'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
