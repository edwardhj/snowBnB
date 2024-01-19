import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SpotActions from '../../store/spots';
import ReserveButton from '../ReserveButton/ReserveButton';
import './Spot.css';

function Spot() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots.spot[spotId]);
    console.log(spot)

    useEffect(() => {
        const getDetails = async () => {
            if (!spot || spot.id !== +spotId){
                await dispatch(SpotActions.getOneSpot(spotId));
            }
        }
        getDetails();
    }, [dispatch, spot, spotId]);
    useEffect(() => {
        dispatch(SpotActions.getAllSpots());
    }, [dispatch, spotId])

    if (!spot){
        return (
            <div>
                <h1>The spot you are looking for does not exist</h1>
            </div>
        )
    }

    return (
        <div className='spot-container'>
            <div className='spot-header'>
                <h1>{spot.name}</h1>
                <p>{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
            </div>

            <div className='spot-images'>
                <div className='spot-mainImg'>
                    <img
                        alt={spot.SpotImages[0].url}
                        src={spot.SpotImages[0].url}
                    />
                </div>
                <div className='spot-sideImg-container'>
                    {spot.SpotImages.slice(1, 5).map((image, index) => (
                    <div key={index} className={`spot-sideImg${index}`}>
                        <img
                            alt={image.url}
                            src={image.url}
                        />
                    </div>
                    ))}
                </div>
            </div>

            <div className='spot-details-container'>
                <div className='spot-details'>
                    <h2>Hosted by {`${spot.Owner.firstName} ${spot.Owner.lastName}`}</h2>
                    <p>
                        {spot.description}
                    </p>
                </div>
                <div className='spot-reserve-button-container'>
                    <div className='spot-reserve-button-details'>
                        <div className='spot-RB-price'>
                            ${spot.price} night
                        </div>
                        <div className='spot-RB-stars-reviews'>
                            <img 
                                className='spot-RB-star-image'
                                src='https://static.vecteezy.com/system/resources/thumbnails/001/189/165/small/star.png'
                            />
                            {`${spot.avgStarRating !== 'no ratings available' ? spot.avgStarRating.toFixed(2) : 'New'} `} 
                            •
                            {` ${spot.numReviews > 0 ? (spot.numReviews === 1 ? '1 Review' : `${spot.numReviews} Reviews`) : 'New'}`}
                        </div>
                    </div>
                        <ReserveButton />
                </div>
            </div>
        </div>
    )

}

export default Spot;