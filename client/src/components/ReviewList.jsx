import React from 'react';

const ReviewList = ({ reviews = [] }) => {
    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    // Calculate rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
        if (distribution[r.rating] !== undefined) distribution[r.rating]++;
    });

    return (
        <div className="review-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 'bold' }}>
                Customer Reviews
            </h2>

            {reviews.length === 0 ? (
                <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    background: 'var(--bg-card)',
                    borderRadius: '1rem',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)'
                }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No reviews yet for this vehicle.</p>
                    <p>Be the first to share your experience!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3rem', alignItems: 'start' }}>
                    {/* Summary Card */}
                    <div style={{
                        background: 'var(--bg-card)',
                        padding: '2rem',
                        borderRadius: '1rem',
                        border: '1px solid var(--border)',
                        position: 'sticky',
                        top: '2rem'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1, color: 'var(--text-color)' }}>
                                {averageRating}
                            </div>
                            <div style={{ color: '#fbbf24', fontSize: '1.5rem', margin: '0.5rem 0' }}>
                                ★★★★★
                            </div>
                            <div style={{ color: 'var(--text-muted)' }}>
                                Based on {reviews.length} reviews
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[5, 4, 3, 2, 1].map(stars => {
                                const count = distribution[stars];
                                const percentage = (count / reviews.length) * 100;
                                return (
                                    <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                                        <span style={{ minWidth: '30px' }}>{stars} ★</span>
                                        <div style={{ flex: 1, height: '6px', background: 'var(--bg-dark)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${percentage}%`,
                                                height: '100%',
                                                background: '#fbbf24',
                                                borderRadius: '3px'
                                            }} />
                                        </div>
                                        <span style={{ minWidth: '30px', textAlign: 'right', color: 'var(--text-muted)' }}>{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Reviews Grid */}
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {reviews.map((review, index) => (
                            <div key={review._id || index} style={{
                                background: 'var(--bg-card)',
                                padding: '1.5rem',
                                borderRadius: '1rem',
                                border: '1px solid var(--border)',
                                transition: 'transform 0.2s ease',
                                cursor: 'default'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: 0, alignItems: 'center' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color, #6366f1))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            color: 'white',
                                            fontSize: '1.2rem',
                                            flexShrink: 0
                                        }}>
                                            {review.user?.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: '0.5rem'
                                            }}>
                                                <span style={{ marginRight: 'auto' }}>{review.user?.name || 'Anonymous User'}</span>
                                                <div style={{ display: 'flex', gap: '0.1rem', color: '#fbbf24' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} style={{ opacity: i < review.rating ? 1 : 0.3 }}>★</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                Verified Renter
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p style={{ lineHeight: '1.6', color: 'var(--text-muted-foreground, inherit)' }}>
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewList;
