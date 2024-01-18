import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SpotActions from '../../store/spots';
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
                    {spot.SpotImages.slice(1).map((image, index) => (
                    <div key={index} className='spot-sideImg'>
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
                <div className='spot-reserve-button'>

                </div>
            </div>
        </div>
    )

}

export default Spot;