// backend/src/controllers/shopController.js
import Shop from "../models/Shop.js";

/**
 * Add a shop (retailer/admin)
 * Body: { name, address, latitude, longitude, metadata }
 */
export const addShop = async (req, res) => {
  try {
    const { name, address, latitude, longitude, metadata } = req.body;
    const owner = req.user?.id;
    const shop = await Shop.create({ name, address, latitude, longitude, metadata, owner });
    res.json({ shop });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const listShops = async (req, res) => {
  try {
    const shops = await Shop.find().sort({ name: 1 });
    res.json({ shops });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /shops/nearby?lat=..&lng=..&radiusKm=..
 * Returns shops sorted by distance. Each shop includes a `distance` (km)
 */
export const getNearbyShops = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ message: "lat & lng query params required" });
    }

    const radiusKm = parseFloat(req.query.radiusKm) || 5; // default 5 km

    // bounding box approx (fast filter)
    const deg = radiusKm / 111; // ~111 km per degree latitude
    const minLat = lat - deg, maxLat = lat + deg;
    const minLng = lng - deg, maxLng = lng + deg;

    const candidates = await Shop.find({
      latitude: { $gte: minLat, $lte: maxLat },
      longitude: { $gte: minLng, $lte: maxLng },
    });

    // Haversine distance
    const toRad = (v) => (v * Math.PI) / 180;
    const distKm = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const withDistance = candidates.map(s => {
      const distance = (s.latitude != null && s.longitude != null)
        ? distKm(lat, lng, s.latitude, s.longitude)
        : Number.POSITIVE_INFINITY;
      return { ...s._doc, distance };
    });

    // sort by distance ascending
    withDistance.sort((a, b) => a.distance - b.distance);

    res.json({ shops: withDistance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
