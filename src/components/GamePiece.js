import React from 'react'


/**
 * Will contain the Retro Rockets gameboard
 */
export const GamePiece = ({ type = 'BLANK', occupant }) => {


    return (
        <div style={{ width: '38px', height: '38px', border: '1px solid #000', backgroundColor: 'rgba(226, 206, 170, 1)'}}>
            { occupant && 
                <div style={{ width: '25px', height: '25px', margin: '5px', background: occupant, borderRadius: '50%' }}>&nbsp;</div>
            }
            
        </div>
    )
}



export default GamePiece