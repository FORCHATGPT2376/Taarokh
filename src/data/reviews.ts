/**
 * Customer reviews. Add only genuine reviews from real customers who have
 * consented to publication. `verifiedPurchase` must only be true when matched
 * to a real order. No ratings markup is emitted unless reviews exist.
 */
export interface Review {
  id: string;
  productHandle: string;
  author: string; // as the customer agreed to be credited
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  date: string;
  verifiedPurchase: boolean;
  consentToPublish: true;
}

export const reviews: Review[] = [];

export const reviewsFor = (handle: string) => reviews.filter((r) => r.productHandle === handle);
