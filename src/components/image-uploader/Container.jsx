import update from "immutability-helper";
import { useCallback } from "react";
import Card from "./Card";

const Container = ({ setImageUrl, imageUrl, handleRemoveImage }) => {
  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      setImageUrl((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })
      );
    },
    [setImageUrl]
  );

  const renderCard = useCallback(
    (card, i) => {
      // Handle both URL strings and objects
      // If card is a string (URL), use it directly; otherwise extract image property
      const imageSrc = typeof card === 'string' ? card : (card?.image || card);
      const cardId = typeof card === 'object' && card.id ? card.id : i;
      
      return (
        <Card
          key={cardId || i}
          index={i}
          id={cardId}
          text={typeof card === 'object' ? card.text : ''}
          moveCard={moveCard}
          image={imageSrc}
          handleRemoveImage={handleRemoveImage}
        />
      );
    },
    [moveCard, handleRemoveImage]
  );
  
  // Ensure imageUrl is an array before mapping
  if (!imageUrl || !Array.isArray(imageUrl) || imageUrl.length === 0) {
    return null;
  }
  
  return <>{imageUrl.map((card, i) => renderCard(card, i))}</>;
};

export default Container;
