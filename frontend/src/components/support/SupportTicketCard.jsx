import React, { useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../components/ui/card';
import { supportService } from '../../services/supportService';

export default function SupportTicketCard({ stations = [] }) {
  const stationOptions = useMemo(() => {
    if (!Array.isArray(stations)) return [];
    return stations.map((s) => ({
      value: s.station_id ?? s.id,
      label: s.name ? `${s.name}${s.address ? ` - ${s.address}` : ''}` : `${s.address || 'Unknown station'}`,
    }));
  }, [stations]);


  // get current user id
  const { user } = useAuth();
  const userId = user?.id ?? user?.user_id;

  // send ticket to backend via supportService
  const createSupportTicket = async (ticketData) => {
    try {
      const response = await supportService.createSupportTicket(ticketData);
      return response;
    } catch (error) {
      console.error('Error creating support ticket:', error);
      throw error;
    }
  };

  // categories map to backend 'type' values required: battery_issue, station_issue, other
  const categories = [
    { value: 'battery_issue', label: 'Battery Issue' },
    { value: 'station_issue', label: 'Station Issue' },
    { value: 'other', label: 'Other / Feedback' },
  ];

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const validationSchema = Yup.object().shape({
    stationId: Yup.number()
      .typeError('Please select a station')
      .required('Station is required'),
    category: Yup.string().oneOf(categories.map((c) => c.value), 'Invalid category').required('Category is required'),
    message: Yup.string().min(10, 'Please provide more details (at least 10 characters)').required('Description is required'),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting: setFormikSubmitting }) => {
    setSubmitting(true);
    setSubmitted(false);
    setErrorMessage('');
    try {
      if (!userId) throw new Error('User not authenticated');

      const payload = {
        user_id: Number(userId),
        station_id: Number(values.stationId),
        type: values.category,
        description: values.message,
      };

      const resp = await createSupportTicket(payload);
      setCreatedTicket(resp);
      setSubmitted(true);
      resetForm();
    } catch (err) {
      console.error('Submit support error:', err);
      setSubmitted(false);
      setErrorMessage(err?.response?.data?.message || err.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
      setFormikSubmitting(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="border-b border-gray-100">
        <CardTitle>Submit a Ticket</CardTitle>
        <CardDescription>Our team will review and get back to you shortly.</CardDescription>
      </CardHeader>

      <Formik
        initialValues={{ stationId: '', category: '', message: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
        <CardContent className="py-2">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Select Charging Station</span>
              <Field
                as="select"
                name="stationId"
                className="form-select w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-gray-900 shadow-xs outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Select</option>
                {stationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Field>
              <ErrorMessage name="stationId" component="div" className="text-sm text-red-600 mt-1" />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Select Type Of Error</span>
              <Field
                as="select"
                name="category"
                className="form-select w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-gray-900 shadow-xs outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Select</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" className="text-sm text-red-600 mt-1" />
            </label>
          </div>

          <label className="flex flex-col gap-2 mt-6">
            <span className="text-sm font-medium text-gray-700">Please describe your issue or feedback</span>
            <Field
              as="textarea"
              name="message"
              placeholder="Enter your message here..."
              className="min-h-36 w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 shadow-xs outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <ErrorMessage name="message" component="div" className="text-sm text-red-600 mt-1" />
          </label>

          {submitted && (
            <div className="mt-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800 border border-green-200">
              Thank you! Your feedback has been submitted.
              {createdTicket && (
                <div className="mt-2 text-sm text-gray-800">
                  <p className="font-medium">Ticket ID: {createdTicket.support_id}</p>
                  <p>Type: {createdTicket.type}</p>
                  <p>Station: {createdTicket.station?.name || createdTicket.station_id}</p>
                  <p className="text-xs text-gray-600">Created at: {createdTicket.created_at ? new Date(createdTicket.created_at).toLocaleString() : ''}</p>
                </div>
              )}
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800 border border-red-200">
              {errorMessage}
            </div>
          )}
        </CardContent>

          <CardFooter className="justify-end border-t border-gray-100 py-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Feedback'}
            </Button>
          </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
