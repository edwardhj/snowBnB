import './ReserveButton.css';

function ReserveButton() {
    const handleReserveClick = () => {
        alert('Feature coming soon');
    }


    return (
        <div>
            <button className='spot-reserve-button' onClick={handleReserveClick}>Reserve</button>
        </div>
    )
}

export default ReserveButton;