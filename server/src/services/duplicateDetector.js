import { db } from '../db/index.js';

export class DuplicateDetector {
  /**
   * Find potential duplicate grievances in the same ward or nearby coordinates
   */
  static findDuplicates({ title, description, category, wardId, coordinates }) {
    const grievances = db.getAllGrievances();
    const activeGrievances = grievances.filter(g => !["CLOSED", "RESOLVED"].includes(g.status));

    const inputTokens = this.tokenize(`${title || ''} ${description || ''}`);
    const results = [];

    for (const g of activeGrievances) {
      let isSameWard = wardId && g.wardId === wardId;
      let isSameCategory = category && g.category === category;
      
      // Calculate token similarity
      const targetTokens = this.tokenize(`${g.title} ${g.description}`);
      const similarity = this.calculateJaccardSimilarity(inputTokens, targetTokens);

      let geoDistanceMeters = null;
      let isNearby = false;
      if (coordinates?.lat && g.coordinates?.lat) {
        geoDistanceMeters = this.haversineDistance(
          coordinates.lat, coordinates.lng,
          g.coordinates.lat, g.coordinates.lng
        );
        if (geoDistanceMeters < 500) { // within 500 meters
          isNearby = true;
        }
      }

      // Strong candidate if:
      // (same ward or nearby) AND (same category OR similarity > 0.35)
      if ((isSameWard || isNearby) && (similarity >= 0.30 || (isSameCategory && similarity >= 0.20))) {
        results.push({
          grievance: g,
          similarityScore: Math.round(similarity * 100),
          isNearby,
          geoDistanceMeters: geoDistanceMeters ? Math.round(geoDistanceMeters) : null,
          matchReason: isNearby 
            ? `Located only ${Math.round(geoDistanceMeters)}m away in same locality` 
            : `Similar keywords reported in ${g.wardName}`
        });
      }
    }

    // Sort by highest similarity
    return results.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, 3);
  }

  static tokenize(text) {
    if (!text) return new Set();
    const stopWords = new Set([
      "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "with", "is", "are", 
      "was", "were", "of", "from", "it", "this", "that", "there", "here", "has", "have", "had", 
      "not", "be", "been", "near", "road", "street", "area"
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    return new Set(words);
  }

  static calculateJaccardSimilarity(setA, setB) {
    if (setA.size === 0 || setB.size === 0) return 0;
    let intersection = 0;
    for (const item of setA) {
      if (setB.has(item)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }

  static haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

