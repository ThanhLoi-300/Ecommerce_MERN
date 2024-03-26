import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import Footer from "../components/Layout/Footer";

const EventsPage = () => {
  //   const { allEvents, isLoading } = useSelector((state) => state.events);
    const allEvents = []
    const isLoading = null
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
            <Header activeHeading={4} />
            {
              allEvents.length > 0 ? (<EventCard active={true} data={allEvents && allEvents[0]} />)
              : (
                <h1 className="text-center w-full py-[100px] text-[20px]">No event</h1>
              )
            }
        </div>
      )}
      <Footer />
    </>
  );
};

export default EventsPage;
