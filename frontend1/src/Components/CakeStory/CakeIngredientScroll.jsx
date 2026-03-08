import React, { useEffect, useRef, useState } from "react";
import "./CakeIngredientScroll.css";

import img1 from "../../images/pic/img1.png";
import img2 from "../../images/pic/img2.png";
import img3 from "../../images/pic/img3.png";
import img4 from "../../images/pic/img4.png";
import img5 from "../../images/pic/img5.png";

const items = [
  { img: img1, title: "Moist Sponge", subtitle: "Light cocoa sponge soaked with chocolate syrup" },
  { img: img2, title: "Chocolate Truffle", subtitle: "Rich Belgian chocolate with smooth ganache" },
  { img: img3, title: "Salted Caramel", subtitle: "Perfectly balanced homemade caramel layer" },
  { img: img4, title: "Berry Confit", subtitle: "Slow cooked berries with tangy sweetness" },
  { img: img5, title: "Crunchy Base", subtitle: "Caramelized crunch for texture" }
];

export default function CakeIngredientScroll() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const totalScroll = window.innerHeight * items.length;
      const scrolled = Math.min(
        Math.max(-rect.top, 0),
        totalScroll
      );

      const progress = scrolled / totalScroll;
      const index = Math.min(
        items.length - 1,
        Math.floor(progress * items.length)
      );

      setActive(index);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="cake-pro-section"
      style={{ height: `${items.length * 100}vh` }}
    >
      <div className="cake-pro-sticky">
        <div className="cake-pro-container">
          <div className="cake-pro-content">

            {/* LEFT IMAGE */}
            <div className="cake-pro-left">
              <img
                src={items[active].img}
                alt={items[active].title}
                className="cake-pro-image"
              />
            </div>

            {/* RIGHT ORBIT */}
            <div className="cake-pro-right">
              <div className="cake-orbit-wrapper">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className={`cake-pro-card cake-orbit-pos-${i} ${active === i ? "active" : ""}`}
                  >
                    <img src={item.img} alt="" />
                    <div className="w-75">
                      <h4>{item.title}</h4>
                      <p>{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}





// import React, {
//   useLayoutEffect,
//   useRef,
//   useState,
//   useCallback
// } from "react";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
// import "./CakeIngredientScroll.css";

// import img1 from "../../images/pic/img1.png";
// import img2 from "../../images/pic/img2.png";
// import img3 from "../../images/pic/img3.png";
// import img4 from "../../images/pic/img4.png";
// import img5 from "../../images/pic/img5.png";

// if (typeof window !== "undefined") {
//   window.history.scrollRestoration = "manual";
// }



// gsap.registerPlugin(ScrollTrigger);

// const items = [
//   { img: img1, title: "Moist Sponge", subtitle: "Light cocoa sponge soaked with chocolate syrup" },
//   { img: img2, title: "Chocolate Truffle", subtitle: "Rich Belgian chocolate with smooth ganache" },
//   { img: img3, title: "Salted Caramel", subtitle: "Perfectly balanced homemade caramel layer" },
//   { img: img4, title: "Berry Confit", subtitle: "Slow cooked berries with tangy sweetness" },
//   { img: img5, title: "Crunchy Base", subtitle: "Caramelized crunch for texture" }
// ];

// export default function CakeIngredientScroll() {
//   const wrapperRef = useRef(null);
//   const pinRef = useRef(null);
//   const [active, setActive] = useState(0);

//   const handleItemClick = useCallback((index) => {
//     setActive(index);
//   }, []);

//   useLayoutEffect(() => {
//     if (!wrapperRef.current || !pinRef.current) return;

//     // 🔴 FORCE scroll to top BEFORE GSAP
//     window.scrollTo(0, 0);

//     let ctx;

//     const init = () => {
//       ctx = gsap.context(() => {

//         ScrollTrigger.getAll().forEach(t => t.kill());

//         const vh = window.innerHeight;
//         const totalScrollDistance = (items.length - 1) * vh;

//         ScrollTrigger.create({
//           trigger: wrapperRef.current,
//           start: "top top",
//           end: `+=${totalScrollDistance}`,
//           pin: pinRef.current,
//           pinSpacing: true,
//           scrub: true,
//           anticipatePin: 1,
//           invalidateOnRefresh: true,

//           onUpdate: (self) => {
//             const index = Math.round(self.progress * (items.length - 1));
//             setActive(index);
//             gsap.set(pinRef.current, { opacity: 1 });
//           }
//         });

//         ScrollTrigger.refresh(true);
//       }, wrapperRef);
//     };

//     // ✅ WAIT 2 FRAMES + LAYOUT STABLE
//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         setTimeout(init, 50);
//       });
//     });

//     return () => {
//       ctx && ctx.revert();
//       ScrollTrigger.getAll().forEach(t => t.kill());
//     };
//   }, []);

//   return (
//     <section ref={wrapperRef} className="cake-scroll-section">
//       <div ref={pinRef} className="cake-scroll-pin">
//         <div className="cake-container">
//           <div className="cake-content">

//             <div className="cake-left">
//               <div className="cake-main-image-container">
//                 <img
//                   key={active}
//                   src={items[active].img}
//                   alt={items[active].title}
//                   className="cake-main-img"
//                 />
//               </div>
//             </div>

//             <div className="cake-right">
//               <div className="cake-orbit-wrapper">
//                 {items.map((item, i) => (
//                   <div
//                     key={i}
//                     className={`cake-orbit-unit cake-orbit-pos-${i} ${active === i ? "cake-active" : ""}`}
//                     onClick={() => handleItemClick(i)}
//                   >
//                     <div className="cake-orbit-img-box">
//                       <img src={item.img} alt={item.title} className="cake-orbit-img" />
//                     </div>
//                     <div className="cake-orbit-content">
//                       <h4 className="cake-orbit-heading">{item.title}</h4>
//                       <p className="cake-orbit-desc">{item.subtitle}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
