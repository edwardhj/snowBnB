import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SpotActions from '../../store/spots';
import { useNavigate } from 'react-router-dom';
import './Spots.css';

function Spots() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spotObject = useSelector(state => state.spots);
    const spotArr = Object.values(spotObject);

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
                <div key={spot.id} className='spot-block' onClick={() => navigate(`/spots/${spot.id}`)}>
                    <img
                        className='spot-image'
                        alt={spot.previewImage}
                        src={spot.previewImage}
                        title={spot.name}
                    />
                    <div className='info-container'>
                        <div>
                            <p className='details'>{`${spot.city}, ${spot.state}`}</p>
                            <p className='price'>${spot.price} night</p>
                        </div>
                        <div className="rating-container">
                            <img 
                            className='star-image'
                            src='https://static.vecteezy.com/system/resources/thumbnails/001/189/165/small/star.png'
                            />
                            {`${spot.avgRating}` || NEW}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Spots;