/* ==========================================================================
   TAKEES MARKETING: OUR WORK  (shown on takees.in/works)

   1) TAKEES_WORKS: posters, websites and videos. One entry per piece.
      title        Name of the work (e.g. "Onam Campaign Poster")
      category     posters | websites | videos
      client       Client name (optional)
      image        Image path, e.g. "/assets/images/works/onam-poster.webp"
      thumb        Small preview for the card (optional)
      site         Shortcut for websites: 'toothent' means the screenshots
                   /assets/images/works/websites/websites-toothent-desktop|thumb|phone.webp
      poster       Shortcut for posters: 'cafe-39-summer-drinks' means
                   /assets/images/works/posters/posters-cafe-39-summer-drinks.webp (+ -thumb)
      description  One or two sentences (optional)
      url          Live link, e.g. for a website (optional)
      placeholder  true = a "coming soon" tile; remove once real work is added

   2) TAKEES_BRANDS: the Branding tab. One entry per brand; clicking a brand
      opens all of its designs.
      name         Brand name
      logo         Logo path (the client logos already on the site)
      cover        Design shown behind the logo on the card (optional; default: first design)
      theme        Wallpaper for a card without designs yet: 'hikaya' or 'vastragni' (optional)
      description  One or two sentences about the branding work (optional)
      designs      List of { title, image, thumb } — logo, stationery, packaging,
                   signage, social posts… (thumb = small preview, optional).
                   Leave [] until the designs are added.
   ========================================================================== */
window.TAKEES_WORKS = [
  { title: 'Azerbaijan Holiday Offer', category: 'posters', client: 'Flyscanner', poster: 'flyscanner-azerbaijan' },
  { title: 'Keema Roll', category: 'posters', client: 'Pani Kum Chai', poster: 'pani-kum-chai-keema-roll' },
  { title: 'Summer Drinks', category: 'posters', client: 'Café 39', poster: 'cafe-39-summer-drinks' },
  { title: 'Biryani Masala', category: 'posters', client: 'IMAX Gold', poster: 'imax-gold-biryani-masala' },
  { title: 'Coworking Cubicles', category: 'posters', client: 'Takees Cowork', poster: 'takees-cowork-cubicles' },
  { title: 'Kiosks for Rent', category: 'posters', client: 'Dune 5', poster: 'dune-5-kiosks' },
  { title: 'Strong Foundations', category: 'posters', client: 'Eqtaad', poster: 'eqtaad-foundations' },
  { title: 'NIOS Admission', category: 'posters', client: 'iCD', poster: 'icd-nios-admission' },
  { title: 'Why Choose Us', category: 'posters', client: 'KeyCee Constructions', poster: 'keycee-why-choose-us' },
  { title: 'Property Resale', category: 'posters', client: 'Roomskart', poster: 'roomskart-property-resale' },
  { title: 'Check-in', category: 'posters', client: 'Snooze Living', poster: 'snooze-living-check-in' },
  { title: 'Gobi Manchurian', category: 'posters', client: 'Albarsha One', poster: 'albarsha-one-gobi-manchurian' },
  { title: 'Pizza', category: 'posters', client: 'The Monsoon', poster: 'the-monsoon-pizza' },
  { title: 'Gold Rice', category: 'posters', client: 'Kyma Gold', poster: 'kyma-gold-rice' },
  { title: 'Meet the New Owner', category: 'posters', client: 'Roomskart', poster: 'roomskart-new-owner' },
  { title: 'Bleach', category: 'posters', client: 'Wahaj', poster: 'wahaj-bleach' },
  { title: 'Bridal Makeup', category: 'posters', client: 'Adaxes', poster: 'adaxes-bridal-makeup' },
  { title: 'Hazelnut Cake', category: 'posters', client: 'The Cakery', poster: 'the-cakery-hazelnut-cake' },
  { title: 'Journey to Wayanad', category: 'posters', client: 'Kyma Gold', poster: 'kyma-gold-wayanad' },
  { title: 'Late Risers Breakfast', category: 'posters', client: 'The Cafe Inn', poster: 'the-cafe-inn-breakfast' },
  { title: 'New Collections', category: 'posters', client: 'The New Store', poster: 'the-new-store-collections' },
  { title: 'Liquid Hand Soap', category: 'posters', client: 'Falaj', poster: 'falaj-hand-soap' },
  { title: 'Chocolate Burger', category: 'posters', client: 'The Cakery', poster: 'the-cakery-chocolate-burger' },
  { title: 'Long-Term Investment', category: 'posters', client: 'Takees Estates', poster: 'takees-estates-investment' },
  { title: 'The Cakery Website', category: 'websites', client: 'The Cakery', site: 'the-cakery', url: 'https://thecakery.in/',
    description: 'Website for a cake shop in Kannur: menu, custom cake orders and quick WhatsApp ordering.' },
  { title: 'Toothent Website', category: 'websites', client: 'Toothent Dental Clinic', site: 'toothent', url: 'https://toothent.com/',
    description: 'Website for a family dental clinic in Taliparamba, Kannur: treatments, the clinic and one-tap appointment calls.' },
  { title: 'Takees Cowork Website', category: 'websites', client: 'Takees Cowork', site: 'takees-cowork', url: 'https://takeescowork.com/',
    description: 'Website for a coworking space in Kannur: amenities, plans, a blog and a downloadable brochure.' },
];
window.TAKEES_WORKS.forEach(w => {
  if (w.site) {
    w.image = `/assets/images/works/websites/websites-${w.site}-desktop.webp`;
    w.thumb = `/assets/images/works/websites/websites-${w.site}-thumb.webp`;
    w.phone = `/assets/images/works/websites/websites-${w.site}-phone.webp`;
    w.phoneThumb = `/assets/images/works/websites/websites-${w.site}-phone-thumb.webp`;
  }
  if (!w.poster) return;
  w.image = `/assets/images/works/posters/posters-${w.poster}.webp`;
  w.thumb = `/assets/images/works/posters/posters-${w.poster}-thumb.webp`;
});

window.TAKEES_BRANDS = [
  {
    name: 'Toothent',
    cover: '/assets/images/works/toothent/toothent-reception-wall.webp',
    logo: '/assets/images/clients/toothent-logo.png',
    description: 'Brand identity for Toothent Dental Clinic: logo, app icon, stationery, clinic signage, reception design and social media.',
    designs: [
      { title: 'Clinic signage', image: '/assets/images/works/toothent/toothent-clinic-signage.webp', thumb: '/assets/images/works/toothent/toothent-clinic-signage-thumb.webp' },
      { title: 'Reception wall', image: '/assets/images/works/toothent/toothent-reception-wall.webp', thumb: '/assets/images/works/toothent/toothent-reception-wall-thumb.webp' },
      { title: 'Instagram profile', image: '/assets/images/works/toothent/toothent-instagram-profile.webp', thumb: '/assets/images/works/toothent/toothent-instagram-profile-thumb.webp' },
      { title: 'Social media poster', image: '/assets/images/works/toothent/toothent-social-poster.webp', thumb: '/assets/images/works/toothent/toothent-social-poster-thumb.webp' },
      { title: 'Letterhead', image: '/assets/images/works/toothent/toothent-letterhead.webp', thumb: '/assets/images/works/toothent/toothent-letterhead-thumb.webp' },
      { title: 'App icon', image: '/assets/images/works/toothent/toothent-app-icon.webp', thumb: '/assets/images/works/toothent/toothent-app-icon-thumb.webp' },
      { title: 'Tagline banner', image: '/assets/images/works/toothent/toothent-tagline-banner.webp', thumb: '/assets/images/works/toothent/toothent-tagline-banner-thumb.webp' },
      { title: 'Wayfinding signage', image: '/assets/images/works/toothent/toothent-exit-signage.webp', thumb: '/assets/images/works/toothent/toothent-exit-signage-thumb.webp' },
    ],
  },
  {
    name: 'Namma Cafe',
    cover: '/assets/images/works/namma-cafe/namma-cafe-hanging-sign.webp',
    logo: '/assets/images/clients/namma-cafe-logo.png',
    description: 'Brand identity for Namma Cafe: signage, outdoor posters, social media, bill design and staff uniforms.',
    designs: [
      { title: 'Hanging shop sign', image: '/assets/images/works/namma-cafe/namma-cafe-hanging-sign.webp', thumb: '/assets/images/works/namma-cafe/namma-cafe-hanging-sign-thumb.webp' },
      { title: 'Rooftop sign', image: '/assets/images/works/namma-cafe/namma-cafe-rooftop-sign.webp', thumb: '/assets/images/works/namma-cafe/namma-cafe-rooftop-sign-thumb.webp' },
      { title: 'Metro poster', image: '/assets/images/works/namma-cafe/namma-cafe-metro-poster.webp', thumb: '/assets/images/works/namma-cafe/namma-cafe-metro-poster-thumb.webp' },
      { title: 'Instagram story', image: '/assets/images/works/namma-cafe/namma-cafe-instagram-story.webp', thumb: '/assets/images/works/namma-cafe/namma-cafe-instagram-story-thumb.webp' },
      { title: 'Bill design', image: '/assets/images/works/namma-cafe/namma-cafe-bill-design.webp', thumb: '/assets/images/works/namma-cafe/namma-cafe-bill-design-thumb.webp' },
      { title: 'Staff apron', image: '/assets/images/works/namma-cafe/namma-cafe-apron.webp', thumb: '/assets/images/works/namma-cafe/namma-cafe-apron-thumb.webp' },
    ],
  },
  {
    name: 'iCD',
    cover: '/assets/images/works/icd/icd-billboard.webp',
    logo: '/assets/images/clients/icd-logo.png',
    description: 'Brand identity for iCD (Institute of Career Development), Kannur: signage, admission billboard, stationery, Instagram and event branding.',
    designs: [
      { title: 'Admission billboard', image: '/assets/images/works/icd/icd-billboard.webp', thumb: '/assets/images/works/icd/icd-billboard-thumb.webp' },
      { title: 'Wall sign', image: '/assets/images/works/icd/icd-wall-sign.webp', thumb: '/assets/images/works/icd/icd-wall-sign-thumb.webp' },
      { title: 'Event backdrop', image: '/assets/images/works/icd/icd-press-wall.webp', thumb: '/assets/images/works/icd/icd-press-wall-thumb.webp' },
      { title: 'Instagram profile', image: '/assets/images/works/icd/icd-instagram-profile.webp', thumb: '/assets/images/works/icd/icd-instagram-profile-thumb.webp' },
      { title: 'Branded notebook', image: '/assets/images/works/icd/icd-notebook.webp', thumb: '/assets/images/works/icd/icd-notebook-thumb.webp' },
      { title: 'Graduation campaign visual', image: '/assets/images/works/icd/icd-graduation-visual.webp', thumb: '/assets/images/works/icd/icd-graduation-visual-thumb.webp' },
    ],
  },
  {
    name: 'Elor Lighting',
    cover: '/assets/images/works/elor/elor-storefront.webp',
    logo: '/assets/images/clients/elor-lighting-logo.png',
    description: 'Premium brand identity for Elor Lighting: storefront, packaging, gift bags, business cards, vehicle branding, uniforms and app icon.',
    designs: [
      { title: 'Storefront signage', image: '/assets/images/works/elor/elor-storefront.webp', thumb: '/assets/images/works/elor/elor-storefront-thumb.webp' },
      { title: 'Packaging box', image: '/assets/images/works/elor/elor-packaging-box.webp', thumb: '/assets/images/works/elor/elor-packaging-box-thumb.webp' },
      { title: 'Gift bags', image: '/assets/images/works/elor/elor-gift-bags.webp', thumb: '/assets/images/works/elor/elor-gift-bags-thumb.webp' },
      { title: 'Business cards', image: '/assets/images/works/elor/elor-business-cards.webp', thumb: '/assets/images/works/elor/elor-business-cards-thumb.webp' },
      { title: 'Vehicle branding', image: '/assets/images/works/elor/elor-vehicle-wrap.webp', thumb: '/assets/images/works/elor/elor-vehicle-wrap-thumb.webp' },
      { title: 'Hanging sign', image: '/assets/images/works/elor/elor-hanging-sign.webp', thumb: '/assets/images/works/elor/elor-hanging-sign-thumb.webp' },
      { title: 'Staff polo shirt', image: '/assets/images/works/elor/elor-polo-shirt.webp', thumb: '/assets/images/works/elor/elor-polo-shirt-thumb.webp' },
      { title: 'Branded ribbon', image: '/assets/images/works/elor/elor-ribbon.webp', thumb: '/assets/images/works/elor/elor-ribbon-thumb.webp' },
      { title: 'App icon', image: '/assets/images/works/elor/elor-app-icon.webp', thumb: '/assets/images/works/elor/elor-app-icon-thumb.webp' },
    ],
  },
  {
    name: 'Vastragni',
    logo: '/assets/images/clients/vastragni-logo.png',
    cover: '/assets/images/works/vastragni/vastragni-showroom.webp',
    theme: 'vastragni',
    description: 'Brand identity for Vastragni, a silk saree brand: showroom, sale posters, shopping bags, business cards, price tags and campaign visuals.',
    designs: [
      { title: 'Showroom interior', image: '/assets/images/works/vastragni/vastragni-showroom.webp', thumb: '/assets/images/works/vastragni/vastragni-showroom-thumb.webp' },
      { title: 'Saree sale poster', image: '/assets/images/works/vastragni/vastragni-saree-poster.webp', thumb: '/assets/images/works/vastragni/vastragni-saree-poster-thumb.webp' },
      { title: 'Shopping bag', image: '/assets/images/works/vastragni/vastragni-shopping-bag.webp', thumb: '/assets/images/works/vastragni/vastragni-shopping-bag-thumb.webp' },
      { title: 'Logo on saree', image: '/assets/images/works/vastragni/vastragni-logo-reveal.webp', thumb: '/assets/images/works/vastragni/vastragni-logo-reveal-thumb.webp' },
      { title: 'Tagline: Silk, Style, Sacred', image: '/assets/images/works/vastragni/vastragni-tagline-banner.webp', thumb: '/assets/images/works/vastragni/vastragni-tagline-banner-thumb.webp' },
      { title: 'Business card', image: '/assets/images/works/vastragni/vastragni-business-card.webp', thumb: '/assets/images/works/vastragni/vastragni-business-card-thumb.webp' },
      { title: 'Price tag', image: '/assets/images/works/vastragni/vastragni-price-tag.webp', thumb: '/assets/images/works/vastragni/vastragni-price-tag-thumb.webp' },
      { title: 'Branded lanyard', image: '/assets/images/works/vastragni/vastragni-lanyard.webp', thumb: '/assets/images/works/vastragni/vastragni-lanyard-thumb.webp' },
    ],
  },
  {
    name: 'Hikaya',
    logo: '/assets/images/clients/hikaya-logo.png',
    cover: '/assets/images/works/hikaya/hikaya-wall-sign.webp',
    theme: 'hikaya',
    description: 'Brand identity for Hikaya: an eight-pointed star emblem in maroon and gold, used across signage, business cards, menu, coffee cups and staff aprons.',
    designs: [
      { title: 'Illuminated wall sign', image: '/assets/images/works/hikaya/hikaya-wall-sign.webp', thumb: '/assets/images/works/hikaya/hikaya-wall-sign-thumb.webp' },
      { title: 'Round hanging sign', image: '/assets/images/works/hikaya/hikaya-round-sign.webp', thumb: '/assets/images/works/hikaya/hikaya-round-sign-thumb.webp' },
      { title: 'Business card', image: '/assets/images/works/hikaya/hikaya-business-card.webp', thumb: '/assets/images/works/hikaya/hikaya-business-card-thumb.webp' },
      { title: 'Leather menu cover', image: '/assets/images/works/hikaya/hikaya-menu-cover.webp', thumb: '/assets/images/works/hikaya/hikaya-menu-cover-thumb.webp' },
      { title: 'Coffee cup', image: '/assets/images/works/hikaya/hikaya-coffee-cup.webp', thumb: '/assets/images/works/hikaya/hikaya-coffee-cup-thumb.webp' },
      { title: 'Staff apron', image: '/assets/images/works/hikaya/hikaya-apron.webp', thumb: '/assets/images/works/hikaya/hikaya-apron-thumb.webp' },
    ],
  },
];
