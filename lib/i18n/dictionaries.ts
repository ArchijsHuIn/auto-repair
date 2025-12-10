export type Dictionary = {
  nav: {
    siteTitle: string;
    home: string;
    customers: string;
    cars: string;
    workOrders: string;
    calendar: string;
    about: string;
  };
  footer: {
    allRightsReserved: string;
  };
};

export type Lang = 'en' | 'lv';

export const dictionaries: Record<Lang, Dictionary> = {
  en: {
    nav: {
      siteTitle: 'Auto Repair Shop',
      home: 'Home',
      customers: 'Customers',
      cars: 'Cars',
      workOrders: 'Work Orders',
      calendar: 'Calendar',
      about: 'About',
    },
    footer: {
      allRightsReserved: 'All rights reserved.',
    },
  },
  lv: {
    nav: {
      siteTitle: 'Auto Remonta Darbnīca',
      home: 'Sākums',
      customers: 'Klienti',
      cars: 'Automašīnas',
      workOrders: 'Darba uzdevumi',
      calendar: 'Kalendārs',
      about: 'Par mums',
    },
    footer: {
      allRightsReserved: 'Visas tiesības aizsargātas.',
    },
  },
};

export const DEFAULT_LANG: Lang = 'en';
