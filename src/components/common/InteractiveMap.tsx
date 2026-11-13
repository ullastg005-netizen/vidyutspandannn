import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Complaint, StreetlightAsset, IncidentGroup } from '../../types';

// Fix Leaflet default marker icons in Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface InteractiveMapProps {
  complaints?: Complaint[];
  streetlights?: StreetlightAsset[];
  incidentGroups?: IncidentGroup[];
  height?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  complaints = [],
  streetlights = [],
  incidentGroups = [],
  height = '500px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous map if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Map centered on Bengaluru
    const map = L.map(mapContainerRef.current).setView([12.9352, 77.5850], 12);
    mapInstanceRef.current = map;

    // OpenStreetMap standard tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom marker icons using SVG divIcons
    const createCustomIcon = (bgColor: string, text: string) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background-color: ${bgColor}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
            ${text}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });
    };

    // 1. Add Complaints Markers
    complaints.forEach((c) => {
      if (c.lat && c.lng) {
        const color = 
          c.priority === 'CRITICAL' ? '#e11d48' :
          c.priority === 'HIGH' ? '#ea580c' :
          c.priority === 'MEDIUM' ? '#d97706' : '#2563eb';

        const marker = L.marker([c.lat, c.lng], {
          icon: createCustomIcon(color, '⚡')
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; font-size: 12px; line-height: 1.4;">
            <div style="font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 4px;">
              ${c.id} - ${c.category.replace(/_/g, ' ')}
            </div>
            <div><strong>Locality:</strong> ${c.locality} (${c.ward})</div>
            <div><strong>Priority:</strong> <span style="color: ${color}; font-weight: bold;">${c.priority}</span></div>
            <div><strong>Status:</strong> ${c.status}</div>
            <div style="color: #64748b; margin-top: 4px;">${c.description}</div>
          </div>
        `);
      }
    });

    // 2. Add Incident Groups (Circles)
    incidentGroups.forEach((grp) => {
      if (grp.lat && grp.lng) {
        const circle = L.circle([grp.lat, grp.lng], {
          color: '#7c3aed',
          fillColor: '#8b5cf6',
          fillOpacity: 0.25,
          radius: 600
        }).addTo(map);

        circle.bindPopup(`
          <div style="font-family: system-ui, sans-serif; font-size: 12px;">
            <div style="font-weight: bold; color: #581c87; font-size: 13px;">
              ⚡ Incident Cluster: ${grp.title}
            </div>
            <div style="margin-top: 4px;"><strong>Locality:</strong> ${grp.locality}</div>
            <div><strong>Correlated Complaints:</strong> ${grp.report_count} consumer reports</div>
            <div><strong>Status:</strong> ${grp.status}</div>
            <div style="color: #475569; font-size: 11px; margin-top: 4px;">${grp.suggested_reason}</div>
          </div>
        `);
      }
    });

    // 3. Add Streetlight Assets
    streetlights.forEach((sl) => {
      if (sl.lat && sl.lng) {
        const color = sl.status === 'WORKING' ? '#059669' : '#dc2626';
        const marker = L.marker([sl.lat, sl.lng], {
          icon: createCustomIcon(color, '💡')
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; font-size: 12px;">
            <div style="font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
              ${sl.pole_number} (${sl.lamp_type})
            </div>
            <div style="margin-top: 4px;"><strong>Owner / Authority:</strong> ${sl.responsible_authority}</div>
            <div><strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${sl.status}</span></div>
            <div><strong>Locality:</strong> ${sl.locality}</div>
          </div>
        `);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [complaints, streetlights, incidentGroups]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} style={{ width: '100%', height }} />

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-slate-200 text-xs space-y-1.5">
        <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider mb-1">
          Map Legend
        </span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
          <span className="text-slate-600">Critical Electricity Hazard</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
          <span className="text-slate-600">High / Medium Priority Outage</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-600 inline-block" />
          <span className="text-slate-600">Feeder Incident Cluster Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
          <span className="text-slate-600">Working Streetlight Pole</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
          <span className="text-slate-600">Faulty Streetlight Pole</span>
        </div>
      </div>
    </div>
  );
};
