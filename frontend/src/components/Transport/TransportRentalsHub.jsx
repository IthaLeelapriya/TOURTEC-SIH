import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getTransportForLocation } from '../../services/transportRentalService';
import {
  Car,
  Bus,
  Briefcase,
  Users,
  Calendar,
  MapPin,
  Star,
  Check,
  CheckCircle2,
  ExternalLink,
  Tag,
  Coins,
  ShieldCheck,
  Phone,
  Clock,
  Sparkles,
  Calculator,
  QrCode,
  ArrowRight,
  Loader2,
  Navigation
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TransportRentalsHub = () => {
  const { currentDestination, ecoPoints, setEcoPoints, requireAuth, currentUser } = useApp();

  const cityName = currentDestination.name.split(',')[0].trim();
  const [activeSection, setActiveSection] = useState('cabs'); // 'cabs' | 'buses' | 'agencies' | 'budget_estimator'

  const [transportData, setTransportData] = useState({ cabs: [], buses: [], agencies: [] });

  // Trip Budget Estimator Controls
  const [tripType, setTripType] = useState('local'); // 'local' | 'outstation'
  const [selectedVehicleType, setSelectedVehicleType] = useState('sedan'); // 'sedan' | 'suv' | 'tempo'
  const [tripDays, setTripDays] = useState(1);
  const [estimatedKm, setEstimatedKm] = useState(150);

  // Booking Modal State
  const [selectedCabForBooking, setSelectedCabForBooking] = useState(null);
  const [pickupDate, setPickupDate] = useState('2026-08-30');
  const [pickupTime, setPickupTime] = useState('09:00 AM');
  const [pickupLocation, setPickupLocation] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [useEcoPointsDiscount, setUseEcoPointsDiscount] = useState(true);
  const [confirmedRentalPass, setConfirmedRentalPass] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setTransportData(getTransportForLocation(currentDestination.name));
  }, [currentDestination]);

  // Live Budget Calculations
  const getVehicleRate = () => {
    if (selectedVehicleType === 'suv') return { local: 2600, perKm: 17, driver: 500, label: 'Innova Crysta SUV' };
    if (selectedVehicleType === 'tempo') return { local: 3900, perKm: 23, driver: 600, label: 'Tempo Traveller (12-Seater)' };
    return { local: 1600, perKm: 12, driver: 400, label: 'Sedan Prime (Dzire / Etios)' };
  };

  const rateInfo = getVehicleRate();
  const estimatedCost = tripType === 'local'
    ? rateInfo.local * tripDays
    : (estimatedKm * rateInfo.perKm) + (rateInfo.driver * tripDays);

  const handleOpenCabBooking = (cab) => {
    requireAuth(() => {
      setSelectedCabForBooking(cab);
      setConfirmedRentalPass(null);
      if (currentUser?.name) setPassengerName(currentUser.name);
      if (currentUser?.phone) setPassengerPhone(currentUser.phone);
    }, { message: 'Please sign in to book cabs and private tourist vehicles.' });
  };

  const handleConfirmRental = (e) => {
    if (e) e.preventDefault();
    if (!passengerName.trim() || !pickupLocation.trim()) {
      alert('Please fill passenger name and pickup address');
      return;
    }

    requireAuth(() => {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        const discountINR = useEcoPointsDiscount && ecoPoints >= 50 ? 200 : 0;
        const finalPrice = Math.max(100, selectedCabForBooking.localRate8hr80km - discountINR);
        const rentalId = `IND-CAB-${Math.floor(100000 + Math.random() * 900000)}`;

        if (discountINR > 0) {
          setEcoPoints(p => Math.max(0, p - 50));
        } else {
          setEcoPoints(p => p + 30);
        }

        setConfirmedRentalPass({
          rentalId,
          vehicleName: selectedCabForBooking.name,
          city: cityName,
          passengerName,
          pickupLocation,
          pickupDate,
          pickupTime,
          finalPrice,
          discountApplied: discountINR,
          driverContact: '+91 98765 12345 (Assigned upon dispatch)'
        });

        confetti({ particleCount: 70, spread: 80 });
      }, 900);
    }, { message: 'Please sign in to confirm your vehicle reservation.' });
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* Top Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 font-heritage">
                Cabs, Buses & Tour Agencies in {cityName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-bold">
                ✓ Verified Fleet & Drivers
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Book full-day private cabs, luxury Volvo tourist coaches, and certified local travel agency packages in <strong>{currentDestination.name}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Destination:</span>
          <span className="px-3.5 py-1.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-xl text-xs font-black font-heritage">
            🇮🇳 {cityName}
          </span>
        </div>
      </div>

      {/* 📊 INTERACTIVE TRIP BUDGET ESTIMATOR CARD */}
      <div className="bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-cyan-500/15 border-2 border-blue-400/80 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-600 text-white rounded-xl font-bold shadow-sm">
              <Calculator className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 font-heritage">
                Live Trip Transport Cost Estimator for {cityName}:
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Calculate exact fuel, driver allowance, and daily rates for your group.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-2xl border border-blue-300 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500">Estimated Total:</span>
            <strong className="text-sm font-mono font-black text-blue-700">₹{estimatedCost.toLocaleString()}</strong>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Trip Mode */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">Trip Type</label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setTripType('local')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                  tripType === 'local' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Local (8hr/80km)
              </button>
              <button
                type="button"
                onClick={() => setTripType('outstation')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                  tripType === 'outstation' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Outstation
              </button>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">Vehicle Category</label>
            <select
              value={selectedVehicleType}
              onChange={(e) => setSelectedVehicleType(e.target.value)}
              className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer py-1"
            >
              <option value="sedan">🚗 Sedan (4-Seater) - ₹1,600/day</option>
              <option value="suv">🚙 Innova SUV (7-Seater) - ₹2,600/day</option>
              <option value="tempo">🚐 Tempo Traveller (12-Seater) - ₹3,900/day</option>
            </select>
          </div>

          {/* Days / Distance */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">
              {tripType === 'local' ? 'Number of Days' : 'Estimated Round-Trip KM'}
            </label>
            {tripType === 'local' ? (
              <select
                value={tripDays}
                onChange={(e) => setTripDays(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer py-1"
              >
                <option value={1}>1 Day (Full Sightseeing)</option>
                <option value={2}>2 Days Weekend Trip</option>
                <option value={3}>3 Days Extended Tour</option>
                <option value={5}>5 Days Complete Circuit</option>
              </select>
            ) : (
              <input
                type="number"
                value={estimatedKm}
                onChange={(e) => setEstimatedKm(Number(e.target.value))}
                step="50"
                min="50"
                className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none py-1 border-b border-slate-200"
                placeholder="Enter KM (e.g. 250)"
              />
            )}
          </div>

        </div>

      </div>

      {/* 3 SUB-TABS: Private Cabs | Tourist Buses | Verified Tour Agencies */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 w-full sm:w-auto text-xs overflow-x-auto scrollbar-none">
        
        <button
          onClick={() => setActiveSection('cabs')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSection === 'cabs' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>🚖 Private Cabs & Taxi Rentals ({transportData.cabs?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSection('buses')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSection === 'buses' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>🚌 Tourist Buses & Volvo Circuits ({transportData.buses?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSection('agencies')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSection === 'agencies' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>💼 Verified Tour Agencies ({transportData.agencies?.length || 0})</span>
        </button>

      </div>

      {/* 1. PRIVATE CABS SECTION */}
      {activeSection === 'cabs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-black text-slate-900 font-heritage">
              Verified Private Cabs & Taxi Rentals in {cityName}:
            </h4>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              ⚡ ₹200 OFF with Reward Points
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {transportData.cabs?.map((cab) => (
              <div
                key={cab.id}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-3xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img src={cab.image} alt={cab.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-950/80 backdrop-blur-md text-blue-300 border border-blue-400/40">
                    {cab.badge}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-xl text-xs font-black bg-white/95 text-slate-950 flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{cab.rating}</span>
                    <span className="text-[9px] text-slate-400 font-normal">({cab.reviewsCount})</span>
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-600" />
                      <span>{cab.capacity}</span>
                    </span>
                    <h3 className="text-sm font-black text-slate-900">{cab.name}</h3>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {cab.features.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[9px] font-bold text-slate-600">
                        ✓ {f}
                      </span>
                    ))}
                  </div>

                  {/* Pricing Matrix */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Local (8hr / 80km):</span>
                      <strong className="font-mono text-slate-900">₹{cab.localRate8hr80km}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Outstation per KM:</span>
                      <strong className="font-mono text-blue-700">₹{cab.outstationPerKm}/km</strong>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Driver Allowance:</span>
                      <span>₹{cab.driverAllowancePerDay}/day</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 font-bold">Free Cancellation</span>
                    <button
                      onClick={() => handleOpenCabBooking(cab)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Reserve Cab Pass</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TOURIST BUSES SECTION */}
      {activeSection === 'buses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-black text-slate-900 font-heritage">
              Guided Sightseeing Buses & Intercity AC Coaches in {cityName}:
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportData.buses?.map((bus) => (
              <div
                key={bus.id}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-3xl p-5 shadow-sm space-y-4 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-black text-blue-600 tracking-wider block">
                        {bus.busType}
                      </span>
                      <h3 className="text-base font-black text-slate-900">{bus.operator}</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-blue-50 text-blue-900 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{bus.rating}</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Covered Circuit & Route:</span>
                    <p className="text-slate-700 font-bold">{bus.route}</p>
                    <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span>Departure: {bus.departureTime}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      ₹{bus.pricePerSeat}
                      <span className="text-[10px] text-slate-400 font-normal font-sans"> / seat</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      {bus.includesGuide ? '✓ Includes Official Tour Guide' : '✓ Luxury AC Sleeper'}
                    </span>
                  </div>

                  <a
                    href={bus.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <span>Book Seats</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. VERIFIED TRAVEL AGENCIES SECTION */}
      {activeSection === 'agencies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-black text-slate-900 font-heritage">
              Government & IATA Certified Travel Agencies in {cityName}:
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportData.agencies?.map((agency) => (
              <div
                key={agency.id}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-3xl p-5 shadow-sm space-y-4 transition flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-900 border border-blue-200">
                        {agency.verifiedBadge}
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1">{agency.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">License: {agency.licenseNo}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-emerald-50 text-emerald-800 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{agency.rating}</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Popular Curated Package:</span>
                      <strong className="text-slate-900">{agency.popularPackage}</strong>
                    </div>
                    <div className="text-slate-500 text-[11px] pt-1">
                      📍 {agency.officeAddress}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`tel:${agency.contactPhone}`}
                    className="flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-800"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{agency.contactPhone}</span>
                  </a>

                  <button
                    onClick={() => alert(`Connecting with ${agency.name} travel desk at ${agency.contactPhone}`)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition"
                  >
                    Request Custom Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CAB RESERVATION MODAL */}
      {selectedCabForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-blue-200 max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white relative">
              <button
                onClick={() => setSelectedCabForBooking(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center font-black transition"
              >
                ✕
              </button>

              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-white/20 rounded-xl text-lg shadow-sm">🚖</span>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-blue-200 block">
                    Instant Cab Rental Pass
                  </span>
                  <h3 className="text-base font-black text-white leading-tight">
                    {selectedCabForBooking.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              
              {!confirmedRentalPass ? (
                <form onSubmit={handleConfirmRental} className="space-y-3.5">
                  
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Destination:</span>
                      <strong className="text-slate-900">{cityName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Rental Package:</span>
                      <strong className="text-slate-900">Local 8 Hours / 80 Kilometers</strong>
                    </div>
                  </div>

                  {/* Passenger Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Passenger Full Name *</label>
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="Enter passenger name..."
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                    />
                  </div>

                  {/* Pickup Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Doorstep Pickup Address / Hotel *</label>
                    <input
                      type="text"
                      required
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="e.g. Taj Hotel / Airport / Railway Station..."
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                    />
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Pickup Date</label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Pickup Time</label>
                      <input
                        type="text"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        placeholder="09:00 AM"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* EcoPoints Discount */}
                  <div className="p-3 bg-blue-50/80 border border-blue-300 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-xs font-black text-blue-950">Use Reward Points Discount</div>
                        <div className="text-[10px] text-blue-800 font-medium">Save ₹200 using 50 Reward Points</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={useEcoPointsDiscount}
                      onChange={(e) => setUseEcoPointsDiscount(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                  </div>

                  {/* Price */}
                  <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Standard Rental Tariff:</span>
                      <span>₹{selectedCabForBooking.localRate8hr80km}</span>
                    </div>
                    {useEcoPointsDiscount && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Reward Points Discount:</span>
                        <span>- ₹200</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black border-t border-slate-700 pt-1.5 text-blue-400">
                      <span>Total Payable:</span>
                      <span>₹{(selectedCabForBooking.localRate8hr80km - (useEcoPointsDiscount ? 200 : 0)).toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{isProcessing ? 'Generating Vehicle Rental Pass...' : 'Confirm Cab Rental Pass'}</span>
                  </button>
                </form>
              ) : (
                /* CONFIRMED PASS WITH QR */
                <div className="space-y-4 text-center animate-fadeIn">
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-3">
                    <div className="inline-block p-2 bg-emerald-100 text-emerald-800 rounded-full">
                      <Check className="w-6 h-6" />
                    </div>

                    <h4 className="font-black text-base text-emerald-950 font-heritage">
                      Vehicle Rental Confirmed!
                    </h4>

                    {/* QR Code */}
                    <div className="p-3 bg-white border-2 border-blue-500 rounded-2xl inline-block shadow-inner">
                      <div className="w-32 h-32 mx-auto bg-slate-900 p-2 rounded-xl flex items-center justify-center text-white font-mono text-center text-[10px]">
                        [ QR CAB PASS ]
                        <br />
                        {confirmedRentalPass.rentalId}
                        <br />
                        {confirmedRentalPass.city}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-left bg-white p-3.5 rounded-xl border border-emerald-200">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Rental ID:</span>
                        <strong className="font-mono text-slate-900">{confirmedRentalPass.rentalId}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Passenger:</span>
                        <strong className="text-slate-900">{confirmedRentalPass.passengerName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Vehicle:</span>
                        <strong className="text-slate-900">{confirmedRentalPass.vehicleName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pickup:</span>
                        <strong className="text-slate-900">{confirmedRentalPass.pickupLocation}</strong>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-1 text-emerald-700 font-bold">
                        <span>Total Payable:</span>
                        <span>₹{confirmedRentalPass.finalPrice.toLocaleString()} (Pay Driver upon Boarding)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCabForBooking(null)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                  >
                    Done / Close Pass
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
