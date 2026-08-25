// Central service catalogue — pricing, descriptions and copy reused across
// the Services grid, the Service Detail page, the cart and checkout.
// Keep slugs stable: they're used as the route param (/services/:slug)
// and as the primary key when writing order_items in Supabase.

export const SERVICES = [
  {
    slug: "house-slabs",
    index: "01",
    title: "House Slabs",
    blurb:
      "Slab-on-ground foundations for new builds, extensions and granny flats, set out and poured to engineering spec.",
    description:
      "Our house slab service covers the full slab-on-ground process from start to finish: site prep and excavation, steel reinforcement and vapour barrier, formwork set-out, and a level pour that's screeded, floated and cured properly. Whether it's a new home build, an extension or a granny flat, we set it out square and pour it to engineering spec, so your framing crew gets a true, reliable base to build on.",
    points: [
      "Site prep & excavation",
      "Steel reinforcement & vapour barrier",
      "Level pour, screeded & cured",
    ],
    pricePerSqm: 25,
    package: { sqm: 150, price: 3750 },
    image: "slab",
  },
  {
    slug: "driveways",
    index: "02",
    title: "Driveways",
    blurb:
      "Residential and commercial driveways built to handle daily traffic, in plain, exposed-aggregate or broom finish.",
    description:
      "We build residential and commercial driveways designed to handle daily traffic and stand up to the weather — base prep and compaction, correctly set falls for drainage, and your choice of plain, broom or exposed-aggregate finish. Every driveway is set out properly first so the finished surface sheds water the right way and looks right from the street.",
    points: [
      "Base prep & compaction",
      "Broom, exposed or plain finish",
      "Falls set for correct drainage",
    ],
    pricePerSqm: 26,
    package: { sqm: 150, price: 4350 },
    image: "broom",
  },
  {
    slug: "formwork",
    index: "03",
    title: "Formwork",
    blurb:
      "Timber and steel formwork set out true and square, ready for pour — supplied standalone or as part of the job.",
    description:
      "Timber and steel formwork set out true and square to plan and engineer detail, ready for the pour. We supply slab-edge and footing formwork either standalone or as part of a full slab or driveway job, and strip it clean afterwards with no rework needed. If your job just needs formwork done properly before your own pour, we can handle that stage on its own.",
    points: [
      "Slab edge & footing formwork",
      "Set out to plan & engineer detail",
      "Stripped clean, no rework",
    ],
    pricePerSqm: 27,
    package: { sqm: 150, price: 4500 },
    image: "exposed",
  },
];

export function getServiceBySlug(slug) {
  return SERVICES.find((s) => s.slug === slug) || null;
}

export function calcLineTotal({ pricePerSqm, sqm, quantity, packageSelected, service }) {
  if (packageSelected && service) {
    return service.package.price * quantity;
  }
  return pricePerSqm * sqm * quantity;
}
