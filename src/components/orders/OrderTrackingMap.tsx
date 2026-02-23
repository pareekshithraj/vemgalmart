import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSocket } from '../../hooks/useSocket';
import { MapPin, Navigation } from 'lucide-react';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for the delivery vehicle
const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png', // A simple truck icon
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
});

interface LocationUpdate {
    lat: number;
    lng: number;
    timestamp: string;
}

// Component to dynamically recenter the map when the delivery truck moves
function RecenterAutomatically({ lat, lng }: { lat: number, lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], map.getZoom(), { animate: true });
    }, [lat, lng, map]);
    return null;
}

interface OrderTrackingMapProps {
    orderId: string;
    deliveryAddress: string;
}

export function OrderTrackingMap({ orderId, deliveryAddress }: OrderTrackingMapProps) {
    const socket = useSocket();
    const [currentLocation, setCurrentLocation] = useState<LocationUpdate | null>(null);
    const [isPinging, setIsPinging] = useState(false);

    useEffect(() => {
        if (!socket) return;

        // Join the specific order room to listen for its GPS updates
        socket.emit('join_order_room', orderId);

        socket.on('delivery_location_update', (data: LocationUpdate) => {
            setCurrentLocation(data);

            // Flash a ping animation
            setIsPinging(true);
            setTimeout(() => setIsPinging(false), 1000);
        });

        // Cleanup
        return () => {
            socket.emit('leave_order_room', orderId);
            socket.off('delivery_location_update');
        };
    }, [socket, orderId]);

    if (!currentLocation) {
        return (
            <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center border border-dashed border-gray-200 h-64">
                <div className="p-3 bg-white rounded-full shadow-sm mb-4">
                    <Navigation className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-gray-900 font-bold">Waiting for GPS Signal</h4>
                <p className="text-sm text-gray-500 mt-1 max-w-sm text-center">
                    The delivery partner will begin broadcasting their live location once they are out for delivery.
                </p>
            </div>
        );
    }

    return (
        <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-inner h-80">
            {/* Live indicator overlay */}
            <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${isPinging ? 'scale-150' : ''}`}></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-bold tracking-wide text-gray-900">LIVE TRACKING</span>
            </div>

            <MapContainer
                center={[currentLocation.lat, currentLocation.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[currentLocation.lat, currentLocation.lng]} icon={truckIcon}>
                    <Popup className="font-sans font-bold text-primary">
                        Your Order is On the Way!
                    </Popup>
                </Marker>

                <RecenterAutomatically lat={currentLocation.lat} lng={currentLocation.lng} />
            </MapContainer>

            {/* Address Banner */}
            <div className="absolute bottom-0 left-0 right-0 z-[400] bg-white/95 backdrop-blur-md border-t border-gray-100 p-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-50 rounded-full text-red-500 shrink-0">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">Destination</p>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{deliveryAddress}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
