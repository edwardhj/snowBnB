import { useNavigate, useLocation } from "react-router-dom";

function SpotCard({spot}) {
    const navigate = useNavigate();
    const location = useLocation();

    const path = location.pathname === '/spots/current';

    return (
            <div className='spots-spot-block' onClick={() => navigate(`/spots/${spot.id}`)}>
                        <img
                            className='spots-spot-image'
                            alt={spot.previewImage}
                            src={spot.previewImage}
                            title={spot.name}
                        />

                        <div className='spots-info-container'>
                            <div className='spots-details-container'>
                                    <p className='spots-spot-details'>{`${spot.city}, ${spot.state}`}</p>
                                    <p className='spots-spot-price'>${spot.price} night</p>
                            </div>
                            <div className="spots-spot-rating-container">
                                {spot.avgRating !== 'no ratings available' && typeof spot.avgRating === 'number' ? (
                                    <>
                                        <img 
                                            className='spots-star-image'
                                            src='https://static.vecteezy.com/system/resources/thumbnails/001/189/165/small/star.png'
                                        />
                                        {spot.avgRating.toFixed(2)}
                                    </>
                                ) : (
                                    'New'
                                )}
                            </div>
                        </div>

                    {path && (
                    <div className='spots-button-container'>
                        <button 
                        className='modify-spot-button' 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/spots/${spot.id}/edit`)}
                        }
                        >
                            Update</button>
                        <button className='modify-spot-button'>Delete</button>
                    </div>
                    )}

            </div>
    )
}

export default SpotCard;