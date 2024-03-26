import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";

const Events = () => {
  //   const { allEvents, isLoading } = useSelector((state) => state.events);
  const allEvents = [];
  const isLoading = null;
  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          {allEvents.length !== 0 && (
            <>
              <div className={`${styles.heading}`}>
                <h1>Popular Events</h1>
              </div>

              <div className="w-full grid">
                <EventCard data={allEvents && allEvents[0]} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;
