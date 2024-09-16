import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { transition1 } from "../transitions";
import { CursorContext } from "../context/CursorContext";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Portfolio = () => {
  const { mouseEnterHandler, mouseLeaveHandler } = useContext(CursorContext);
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        setLoading(true);
        const weddingsCollection = collection(db, "weddings");
        const snapshot = await getDocs(weddingsCollection);
        const weddingList = [];

        for (const docSnap of snapshot.docs) {
          const weddingName = docSnap.id;
          const weddingDoc = doc(db, "weddings", weddingName);
          const docSnapshot = await getDoc(weddingDoc);

          if (docSnapshot.exists()) {
            const weddingData = docSnapshot.data();
            const images = weddingData.images || [];
            const displayName = weddingData.name || weddingName;
            weddingList.push({
              name: displayName,
              images: images.slice(0, 3),
            });
          }
        }

        setWeddings(weddingList);
      } catch (error) {
        console.error("Error fetching wedding data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeddings();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={transition1}
      className="section min-h-screen overflow-y-auto"
    >
      <div className="container mx-auto relative">
        <div className="flex flex-col items-center justify-center gap-y-8 text-center pt-24 lg:pt-36 pb-8">
          <motion.div
            initial={{ opacity: 0, y: "-80%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-80%" }}
            transition={transition1}
            onMouseEnter={mouseEnterHandler}
            onMouseLeave={mouseLeaveHandler}
            className="w-full"
          >
            <h1 className="h1 mb-8">Portfolio</h1>
            <p className="mb-12 max-w-lg mx-auto text-center">
              Browse through our wedding galleries. Click on a wedding name to
              view more photos.
            </p>

            <div className="w-full">
              {loading ? (
                <p>Loading weddings...</p>
              ) : weddings.length > 0 ? (
                weddings.map((wedding) => (
                  <div key={wedding.name} className="mb-12 w-full">
                    <h1 className="h1 text-2xl font-bold mb-4 text-center">
                      <Link to={`/wedding/${wedding.name}`}>
                        {wedding.name}
                      </Link>
                    </h1>
                    <div className="w-full flex justify-between gap-2">
                      {wedding.images.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="w-full h-64 overflow-hidden"
                        >
                          <img
                            src={imageUrl}
                            alt={`${wedding.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No weddings available.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Portfolio;
