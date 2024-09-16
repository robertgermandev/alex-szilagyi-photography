import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";
import { motion } from "framer-motion";
import { transition1 } from "../transitions";

const WeddingDetails = () => {
  const { weddingName } = useParams();
  const [weddingData, setWeddingData] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchDocumentId = async () => {
      try {
        const weddingsCollection = collection(db, "weddings");
        const snapshot = await getDocs(weddingsCollection);

        let foundId = null;
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.name === weddingName) {
            foundId = docSnap.id;
          }
        });

        if (foundId) {
          setDocumentId(foundId);
        } else {
          console.error("No such wedding name found!");
        }
      } catch (error) {
        console.error("Error fetching wedding document IDs: ", error);
      }
    };

    fetchDocumentId();
  }, [weddingName]);

  useEffect(() => {
    const fetchWeddingDetails = async () => {
      if (!documentId) return;

      try {
        const weddingDoc = doc(db, "weddings", documentId);
        const docSnapshot = await getDoc(weddingDoc);

        if (docSnapshot.exists()) {
          setWeddingData(docSnapshot.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching wedding details: ", error);
      }
    };

    fetchWeddingDetails();
  }, [documentId]);

  if (!weddingData) {
    return (
      <div className="container mx-auto pt-24 lg:pt-36 pb-8 text-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={transition1}
      className="section min-h-screen overflow-y-auto"
    >
      <div className="container mx-auto pt-24 lg:pt-36 pb-8">
        <h1 className="h1 text-3xl font-bold mb-8 text-center">
          {weddingData.name}
        </h1>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {weddingData.images && weddingData.images.length > 0 ? (
            weddingData.images.map((imageUrl, index) => (
              <div
                key={index}
                className="w-full h-64 overflow-hidden cursor-pointer"
                onClick={() => {
                  setIsOpen(true);
                  setPhotoIndex(index);
                }}
              >
                <img
                  src={imageUrl}
                  alt={`${weddingData.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-xl font-semibold">
              No images available for this wedding.
            </p>
          )}
        </div>
        {isOpen && (
          <Lightbox
            mainSrc={weddingData.images[photoIndex]}
            nextSrc={
              weddingData.images[(photoIndex + 1) % weddingData.images.length]
            }
            prevSrc={
              weddingData.images[
                (photoIndex + weddingData.images.length - 1) %
                  weddingData.images.length
              ]
            }
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex(
                (photoIndex + weddingData.images.length - 1) %
                  weddingData.images.length
              )
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % weddingData.images.length)
            }
          />
        )}
      </div>
    </motion.section>
  );
};

export default WeddingDetails;
