import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SpotActions from '../../store/spots';
import './Spot.css';

function Spot() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots.spot[spotId]);

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
            <div className='header'>
                <h1>{spot.name}</h1>
                <p>{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
            </div>

            <div className='images-spot'>
                <div className='mainImg'>
                    <img
                        alt={spot.SpotImages[0].url}
                        src={spot.SpotImages[0].url}
                    />
                </div>
                <div className='sideImg-container'>
                    <div className='sideImg'>

                    </div>
                </div>
            </div>

            <div className='spot-details-container'>
                <div className='details'>
                    <h2>Hosted by {`${spot.Owner.firstName} ${spot.Owner.lastName}`}</h2>
                </div>

            </div>
        </div>
    )

}

export default Spot;