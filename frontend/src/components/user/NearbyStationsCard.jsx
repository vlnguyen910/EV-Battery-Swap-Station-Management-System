import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MapPin } from 'lucide-react';

export default function NearbyStationsCard({ stations = [], onViewAll }) {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle>Nearby Stations</CardTitle>
        <Button variant="link" className="px-0" onClick={onViewAll}>View All</Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {stations.map((st) => (
          <div key={st.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-600" size={18} />
              <div>
                <p className="font-medium text-gray-900">{st.name}</p>
                <p className="text-gray-500 text-sm">{st.address}</p>
              </div>
            </div>
            <p className="text-green-700 font-medium text-sm">{st.available}/{st.total} slots</p>
          </div>
        ))}
        {stations.length === 0 && (
          <p className="text-sm text-gray-500">No stations available.</p>
        )}
      </CardContent>
    </Card>
  );
}
