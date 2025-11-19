import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '../../components/ui/button';
import { Search, Star } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const stationOptions = useMemo(() => {
    if (!Array.isArray(stations)) return [];
    const allStations = stations.map((s) => ({
      value: s.station_id ?? s.id,
      label: s.name ? `${s.name}${s.address ? ` - ${s.address}` : ''}` : `${s.address || 'Unknown station'}`,
      name: s.name || '',
    }));
    
    // Filter by search query
    if (!searchQuery.trim()) return allStations;
    const query = searchQuery.toLowerCase();
    return allStations.filter(st => st.label.toLowerCase().includes(query));
  }, [stations, searchQuery]);


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
    rating: Yup.number().min(1, 'Please select a rating').max(5).required('Rating is required'),
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
        rating: Number(values.rating),
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
        initialValues={{ stationId: '', category: '', rating: 0, message: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
        <CardContent className="py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Select Charging Station</span>
              
              {/* Search/Select Combined */}
              <div className="relative" ref={dropdownRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Search and select station..."
                  value={selectedStation ? selectedStation.label : searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedStation(null);
                    setFieldValue('stationId', '');
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full h-10 rounded-md border border-gray-300 bg-white pl-10 pr-3 text-gray-900 shadow-xs outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                
                {/* Dropdown Results */}
                {showDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {stationOptions.length > 0 ? (
                      stationOptions.map((station) => (
                        <button
                          key={station.value}
                          type="button"
                          onClick={() => {
                            setSelectedStation(station);
                            setSearchQuery('');
                            setFieldValue('stationId', station.value);
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
                        >
                          <div className="text-sm text-gray-900">{station.label}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">No stations found</div>
                    )}
                  </div>
                )}
                
                {/* Hidden field for Formik */}
                <Field type="hidden" name="stationId" />
              </div>
              <ErrorMessage name="stationId" component="div" className="text-sm text-red-600 mt-1" />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">What you are having issue with</span>
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

          {/* Rating Section */}
          <label className="flex flex-col gap-2 mt-6">
            <span className="text-sm font-medium text-gray-700">Rate your experience</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFieldValue('rating', star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= values.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {values.rating > 0 ? `${values.rating} star${values.rating > 1 ? 's' : ''}` : 'No rating'}
              </span>
            </div>
            <ErrorMessage name="rating" component="div" className="text-sm text-red-600 mt-1" />
          </label>

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
                  <p>Rating: {createdTicket.rating ? `${createdTicket.rating} star${createdTicket.rating > 1 ? 's' : ''}` : 'N/A'}</p>
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
