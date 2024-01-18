import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SpotActions from '../../store/spots';
import { useNavigate } from 'react-router-dom';
import './Spots.css';

function Spots() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spotObject = useSelector(state => state.spots.spots);
    const spotArr = Object.values(spotObject);
    console.log(spotObject)

    useEffect(() => {
        dispatch(SpotActions.getAllSpots());
    }, [dispatch])

    if (!spotArr.length){
        return (
            <div>
                <h1>Currently, there are no spots available</h1>
            </div>
        )
    }

    return (
        <div className='spots-container'>
            {spotArr.map(spot => (
                <div key={spot.id} className='spots-spot-block' onClick={() => navigate(`/spots/${spot.id}`)}>
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
                </div>
            ))}
        </div>
    );
}

export default Spots;