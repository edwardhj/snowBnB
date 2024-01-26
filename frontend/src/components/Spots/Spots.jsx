import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SpotActions from '../../store/spots';
import SpotCard from '../Spot/SpotCard';
import './Spots.css';

function Spots() {
    const dispatch = useDispatch();
    const spotObject = useSelector(state => state.spots.spots);
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
                <SpotCard spot={spot} key={spot.id}/>
            ))}
        </div>
    );
}

export default Spots;