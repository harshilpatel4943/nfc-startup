import React from 'react';
import type { RestaurantConfig } from '../../../config/restaurantConfig';
import type { DemoSetup } from '../../../data/demoStore';

interface RestaurantSettingsPageProps { setup: DemoSetup; onChange: (setup: DemoSetup) => void }

export const RestaurantSettingsPage: React.FC<RestaurantSettingsPageProps> = ({ setup, onChange }) => {
  const setField = <K extends keyof RestaurantConfig>(key: K, value: RestaurantConfig[K]) => onChange({ ...setup, restaurant: { ...setup.restaurant, [key]: value } });
  const setHours = (key: keyof RestaurantConfig['openingHours'], value: string) => setField('openingHours', { ...setup.restaurant.openingHours, [key]: value });
  const textField = (id: string, label: string, value: string, onValue: (value: string) => void, hint?: string) => <label htmlFor={id} className="block text-sm font-semibold text-[#41382F]">{label}<input id={id} value={value} onChange={(event) => onValue(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-[#DCD3C8] bg-white px-3 font-normal text-[#211D19] outline-none transition focus:border-[#8C5138] focus:ring-2 focus:ring-[#8C5138]/15" />{hint && <span className="mt-1 block text-xs font-normal text-[#837A70]">{hint}</span>}</label>;

  return <div className="space-y-5">
    <div><h2 className="text-xl font-bold">Restaurant setup</h2><p className="mt-1 text-sm text-[#756C62]">These details appear on the public customer page after you publish.</p></div>
    <section className="rounded-2xl border border-[#E8E2D9] bg-white p-5 sm:p-6">
      <h3 className="font-bold">Restaurant profile</h3><p className="mt-1 text-sm text-[#756C62]">Basic information guests see after tapping a table tag.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {textField('restaurant-name', 'Restaurant name', setup.restaurant.name, (value) => setField('name', value))}
        {textField('restaurant-tagline', 'Cuisine or tagline', setup.restaurant.tagline, (value) => setField('tagline', value))}
        {textField('restaurant-city', 'City', setup.restaurant.city, (value) => setField('city', value))}
        {textField('restaurant-phone', 'Contact phone', setup.restaurant.phone, (value) => setField('phone', value))}
        {textField('restaurant-address', 'Street address', setup.restaurant.address, (value) => setField('address', value))}
        {textField('restaurant-map', 'Map link', setup.restaurant.mapsUrl, (value) => setField('mapsUrl', value), 'Use the restaurant’s shareable map URL.')}
        {textField('restaurant-review', 'Google review link', setup.restaurant.googleReviewUrl, (value) => setField('googleReviewUrl', value), 'Replace the sample placeholder with the restaurant review URL.')}
        {textField('restaurant-instagram', 'Instagram profile link', setup.restaurant.instagramUrl, (value) => setField('instagramUrl', value))}
        {textField('restaurant-wifi', 'Guest Wi-Fi network', setup.restaurant.wifiNetwork, (value) => setField('wifiNetwork', value))}
        {textField('restaurant-password', 'Guest Wi-Fi password', setup.restaurant.wifiPassword, (value) => setField('wifiPassword', value), 'This is displayed to guests on the public page.')}
        <label htmlFor="restaurant-description" className="block text-sm font-semibold text-[#41382F] md:col-span-2">About the restaurant<textarea id="restaurant-description" rows={3} value={setup.restaurant.heroDescription} onChange={(event) => setField('heroDescription', event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#DCD3C8] bg-white px-3 py-2 font-normal text-[#211D19] outline-none focus:border-[#8C5138] focus:ring-2 focus:ring-[#8C5138]/15" /></label>
      </div>
    </section>

    <section className="rounded-2xl border border-[#E8E2D9] bg-white p-5 sm:p-6">
      <h3 className="font-bold">Opening hours</h3><p className="mt-1 text-sm text-[#756C62]">Keep service days and times accurate for guests.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {textField('restaurant-days', 'Days open', setup.restaurant.openingHours.days, (value) => setHours('days', value))}
        {textField('restaurant-lunch', 'Lunch hours', setup.restaurant.openingHours.lunch, (value) => setHours('lunch', value))}
        {textField('restaurant-dinner', 'Dinner hours', setup.restaurant.openingHours.dinner, (value) => setHours('dinner', value))}
      </div>
    </section>
    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900"><strong>Demo data note:</strong> These settings are saved in this browser only. A live restaurant account will need secure sign-in and hosted storage before customer launch.</div>
  </div>;
};
