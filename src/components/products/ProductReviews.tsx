import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { Star } from 'lucide-react';

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
        name: string;
    };
}

export function ProductReviews({ productId }: { productId: string }) {
    const { user } = useAuthStore();
    const { addToast } = useToast();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState('0.0');
    const [totalReviews, setTotalReviews] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [isWriting, setIsWriting] = useState(false);
    const [ratingForm, setRatingForm] = useState(5);
    const [commentForm, setCommentForm] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/reviews/${productId}`);
            setReviews(response.data.reviews);
            setAverageRating(response.data.averageRating);
            setTotalReviews(response.data.totalReviews);
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setIsLoading(false);
        }
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            addToast('Please login to leave a review', 'error');
            return;
        }

        try {
            await api.post(`/reviews/${productId}`, {
                rating: ratingForm,
                comment: commentForm
            });
            addToast('Review submitted successfully!', 'success');
            setIsWriting(false);
            setCommentForm('');
            fetchReviews(); // Reload the list
        } catch (error: any) {
            addToast(error.response?.data?.message || 'Failed to submit review', 'error');
        }
    };

    if (isLoading) return <div className="animate-pulse h-32 bg-gray-100 rounded-2xl w-full mt-12"></div>;

    return (
        <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.round(Number(averageRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                                />
                            ))}
                        </div>
                        <span className="text-xl font-bold text-gray-900">{averageRating}</span>
                        <span className="text-gray-500 text-sm">Based on {totalReviews} reviews</span>
                    </div>
                </div>

                {user ? (
                    <Button onClick={() => setIsWriting(!isWriting)} variant="outline">
                        {isWriting ? 'Cancel' : 'Write a Review'}
                    </Button>
                ) : (
                    <p className="text-sm text-gray-500">Log in to leave a review</p>
                )}
            </div>

            {isWriting && (
                <form onSubmit={submitReview} className="bg-gray-50 p-6 rounded-2xl mb-12 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Share your experience</h3>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRatingForm(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star className={`w-8 h-8 ${star <= ratingForm ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-100'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                        <textarea
                            rows={4}
                            value={commentForm}
                            onChange={(e) => setCommentForm(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="What did you like or dislike about this product?"
                        />
                    </div>

                    <Button type="submit" className="px-8">Post Review</Button>
                </form>
            )}

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                                        />
                                    ))}
                                </div>
                                <span className="font-bold text-gray-900">{review.user.name}</span>
                                <span className="text-xs text-gray-400 ml-2">
                                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            {review.comment && (
                                <p className="text-gray-600 leading-relaxed mt-2">{review.comment}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
