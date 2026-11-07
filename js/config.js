/* CENTRAL EVENT CONFIGURATION — edit only this file to update the invitation.
   `null` = not yet confirmed (nothing is invented). */
window.EVENT = {
  bride: 'Fiza Abdullah',
  groom: 'Hassan Ahmed Khan',
  title: 'Barat Ceremony',
  titleUrdu: 'بارات',
  closingSignature: 'Muhammad Abdullah and Family',

  date: { day: 2, month: 1, year: 2027, display: '2 January' },
  time: '19:30',               // 24h "HH:mm", e.g. "19:30" — leave null until confirmed
  timeZone: 'Asia/Karachi',
  utcOffset: '+05:00',        // Pakistan has no DST

  venue: 'Elysian Marquee',
  area: 'Model Town, Lahore',
  address: 'Hall B, near Pakistan Engineering Council, Block K, Model Town, Lahore, Pakistan', // from the Google Maps listing
  mapUrl: 'https://www.google.com/maps/place/Elysian+banquet/@31.4821007,74.294871,15z/data=!3m1!4b1!4m16!1m9!4m8!1m0!1m6!1m2!1s0x391905ccdeede16b:0x7c9ecd4be7ac9515!2sElysian+banquet,+Hall+B,+near+pakistan+engineering+council,+Block+K+Model+Town,+Lahore,+54000,+Pakistan!2m2!1d74.3133251!2d31.4820837!3m5!1s0x391905ccdeede16b:0x7c9ecd4be7ac9515!8m2!3d31.4820837!4d74.3133251!16s%2Fg%2F11xflxpnh3',
  mapQuery: 'Elysian Marquee, Model Town, Lahore, Pakistan', // used only if mapUrl is empty

  contact: {
  rsvp: [
    { label: 'RSVP – Adil Abdullah', whatsapp: '+923236472071' },
    { label: 'RSVP – Bilal Abdullah',   whatsapp: '+923234280289' },
    { label: 'RSVP – Aneeq Imran',   whatsapp: '+923098038433' }
    // add more lines the same way
  ]
},// optional, e.g. "+92xxxxxxxxxx"

  invitation: {
    src: 'images/invitation-card.webp', w: 1161, h: 1548,
    alt: 'Barat invitation card with the title بارات: Groom Hassan Ahmed Khan, Bride Fiza Abdullah, 2 January 2027, Elysian Marquee, Model Town, Lahore, with an illustrated couple in red and gold among roses and lanterns.'
  },

  gallery: [
    { src: 'images/venue-1.webp', thumb: 'images/venue-1-t.webp', w: 670, h: 1194, caption: 'A Warm Welcome Awaits', alt: 'Elysian Marquee entrance at dusk with its glowing sign and warm golden lighting.' },
    { src: 'images/venue-2.webp', thumb: 'images/venue-2-t.webp', w: 670, h: 1194, caption: 'A Canopy of Lights', alt: 'Marquee hall with a crystal chandelier and a ceiling of twinkling fairy lights.' },
    { src: 'images/venue-3.webp', thumb: 'images/venue-3-t.webp', w: 670, h: 1194, caption: 'Elegance in Every Detail', alt: 'Dining area with gold-framed chairs, white floral garlands and warm lighting.' },
    { src: 'images/venue-4.webp', thumb: 'images/venue-4-t.webp', w: 830, h: 1238, caption: 'Crystal & Candlelight', alt: 'Crystal chandelier with candle-style lights among white blossoms.' }
  ]
};
