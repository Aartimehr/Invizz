"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

// The interactive parts of the Our Story page. Nothing here is saved or sent anywhere:
// every choice and every picture stays in the visitor's own browser.

const styleStories = [
  { name: "Minimal", message: "Clean lines, quiet colours, nothing extra. You know that less only works when every detail is right." },
  { name: "Bold", message: "Big shapes, strong colour, no apology. You would rather be remembered than blend in." },
  { name: "Romantic", message: "Soft fabrics, gentle volume, a little drama. You like clothes that feel like a mood." },
  { name: "Streetwear", message: "Easy fits, graphic ideas, real comfort. You wear what works for your day and make it look deliberate." },
  { name: "Experimental", message: "Unexpected cuts, odd pairings, rules bent on purpose. You are the reason we want to leave room for new ideas." },
];

export function StylePicker() {
  const [chosen, setChosen] = useState<string | null>(null);
  const story = styleStories.find((item) => item.name === chosen);

  return (
    <div className="st-picker">
      <h3>What&apos;s your style story?</h3>
      <div className="st-options">
        {styleStories.map((item) => (
          <button className="st-chip" type="button" aria-pressed={chosen === item.name} onClick={() => setChosen(item.name)} key={item.name}>
            {item.name}
          </button>
        ))}
      </div>
      <p className="st-picker-result" aria-live="polite">
        {story ? <>{story.message}<small>There&apos;s room for that here.</small></> : <small>Pick the one that sounds most like you.</small>}
      </p>
    </div>
  );
}

export function InspirationTeaser() {
  const [preview, setPreview] = useState<string | null>(null);
  const current = useRef<string | null>(null);

  function show(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (current.current) URL.revokeObjectURL(current.current);
    current.current = URL.createObjectURL(file);
    setPreview(current.current);
  }

  useEffect(() => () => { if (current.current) URL.revokeObjectURL(current.current); }, []);

  return (
    <div className="st-upload">
      <label className="st-polaroid">
        <input className="visually-hidden" type="file" accept="image/*" onChange={show} />
        {/* eslint-disable-next-line @next/next/no-img-element -- a picture from the visitor's own device */}
        {preview ? <img src={preview} alt="The picture you chose" /> : <span><b aria-hidden="true">+</b>Choose a picture or sketch</span>}
      </label>
      <div>
        <h3>Show us what you imagine.</h3>
        {preview ? (
          <p aria-live="polite">That&apos;s the kind of idea we want to build around. Your picture has stayed on your device: our design service isn&apos;t open yet, so nothing was sent to us.</p>
        ) : (
          <p aria-live="polite">Bring us your inspiration. We&apos;ll work with you to make it your own. Try it with a saved post, a board or a sketch.</p>
        )}
        <Link className="hm-link" href="#join">Join the launch list</Link>
      </div>
    </div>
  );
}

const silhouettes = [
  { name: "Boxy shirt", note: "A straight, roomy cut hangs away from the body and reads relaxed, even in a crisp fabric.", path: "M60 44 L86 32 Q100 46 114 32 L140 44 L176 80 L156 100 L140 86 L140 204 L60 204 L60 86 L44 100 L24 80 Z" },
  { name: "A-line dress", note: "Fitted at the top and wider at the hem, so the shape moves when you do.", path: "M78 30 Q100 48 122 30 L134 44 L128 72 Q126 96 152 216 L48 216 Q74 96 72 72 L66 44 Z" },
  { name: "Flared-sleeve top", note: "Keep the body simple and put the volume in the sleeve, and the whole piece turns dramatic.", path: "M70 36 Q100 62 130 36 L150 46 L186 124 L160 136 L140 94 L138 176 L62 176 L60 94 L40 136 L14 124 L50 46 Z" },
];

const fabrics = [
  { name: "Cotton", note: "Matte and breathable. Cotton holds a clean shape and softens every time it is washed." },
  { name: "Linen", note: "A visible weave and an easy crumple. Linen makes the same design look cooler and more lived-in." },
  { name: "Satin", note: "Light slides across satin, so the same cut suddenly looks dressed up." },
];

const colours = [
  { name: "Ivory", value: "#efe6d6", dark: false, note: "Pale shades show every seam and fold, so the cut itself does the talking." },
  { name: "Sand", value: "#c9ae8c", dark: false, note: "A warm neutral sits quietly next to almost anything else you own." },
  { name: "Sage", value: "#8a9278", dark: false, note: "A muted green feels calm and a little unexpected at the same time." },
  { name: "Burgundy", value: "#6b2636", dark: true, note: "A deep colour turns a simple shape into the piece people notice." },
  { name: "Ink", value: "#26241f", dark: true, note: "Near-black hides the construction and leaves only the outline." },
];

const finishes = [
  { name: "Clean edge", note: "No visible stitching: the quietest finish, and the most formal." },
  { name: "Topstitching", note: "A line of stitching near the edge makes a piece look sturdier and more casual." },
  { name: "Contrast piping", note: "A thin edge in another colour draws the outline of the garment like a pen." },
];

const tabs = [
  { id: "silhouette", label: "Silhouette", icon: "M8 3 4 6l2 3 1-1v10h10V8l1 1 2-3-4-3c-1 2-7 2-8 0Z" },
  { id: "fabric", label: "Fabric", icon: "M4 6h16M4 10h16M4 14h16M4 18h16M8 4v16M12 4v16M16 4v16" },
  { id: "colour", label: "Colour", icon: "M12 3c3 4 6 7 6 10.5a6 6 0 0 1-12 0C6 10 9 7 12 3Z" },
  { id: "finish", label: "Finishing", icon: "M4 19 19 4M7 19l12-12M4 16 16 4" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function DetailsStudio() {
  const [tab, setTab] = useState<TabId>("silhouette");
  const [choice, setChoice] = useState({ silhouette: 0, fabric: 0, colour: 0, finish: 0 });

  const shape = silhouettes[choice.silhouette];
  const colour = colours[choice.colour];
  const line = colour.dark ? "#f8f4ed" : "#191816";
  const options = { silhouette: silhouettes, fabric: fabrics, colour: colours, finish: finishes }[tab];
  const note = options[choice[tab]].note;

  return (
    <div className="st-tablet">
      <div className="st-tablet-head">The details make the difference. <span>Preview</span></div>
      <div className="st-tablet-body">
        <div className="st-tabs" role="tablist" aria-label="Design details">
          {tabs.map((item) => (
            <button className="st-tab" type="button" role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)} key={item.id}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={item.icon} /></svg>
              {item.label}
            </button>
          ))}
        </div>
        <div className="st-stage" role="tabpanel">
          <div className="st-garment">
            <svg viewBox="0 0 200 240" role="img" aria-label={`${shape.name} in ${colour.name.toLowerCase()} ${fabrics[choice.fabric].name.toLowerCase()}, ${finishes[choice.finish].name.toLowerCase()}`}>
              <defs>
                <pattern id="st-linen" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 2.5h5M2.5 0v5" stroke={line} strokeWidth=".35" opacity=".35" /></pattern>
                <linearGradient id="st-satin" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".35" stopColor="#fff" stopOpacity=".45" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset=".75" stopColor="#fff" stopOpacity=".3" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={shape.path} fill={colour.value} stroke={choice.finish === 2 ? (colour.dark ? "#c9ae8c" : "#6b2636") : line} strokeWidth={choice.finish === 2 ? 3 : 1.2} strokeLinejoin="round" />
              {choice.fabric === 1 && <path d={shape.path} fill="url(#st-linen)" />}
              {choice.fabric === 2 && <path d={shape.path} fill="url(#st-satin)" />}
              {choice.finish === 1 && <path d={shape.path} fill="none" stroke={line} strokeWidth=".9" strokeDasharray="3 2.4" transform="translate(100 124) scale(.92) translate(-100 -124)" />}
            </svg>
          </div>
          <div className="st-options">
            {options.map((option, index) => tab === "colour" ? (
              <button className="st-swatch" type="button" style={{ background: colours[index].value }} aria-label={option.name} aria-pressed={choice.colour === index} onClick={() => setChoice({ ...choice, colour: index })} key={option.name} />
            ) : (
              <button className="st-chip" type="button" aria-pressed={choice[tab] === index} onClick={() => setChoice({ ...choice, [tab]: index })} key={option.name}>{option.name}</button>
            ))}
          </div>
          <p className="st-note" aria-live="polite">{note}</p>
        </div>
      </div>
    </div>
  );
}

const stages = [
  { title: "Inspiration", text: "It starts with what you already love: a saved post, a board, a sketch, or a picture that only exists in your head." },
  { title: "Design", text: "You explore styles, colours and details until the idea looks like yours." },
  { title: "Confirmation", text: "We review the design with you and agree what can be made, the materials and the price, before anything is cut." },
  { title: "Creation", text: "Then we aim to bring it to life with suitable materials and careful craftsmanship." },
];

// Each stage lights up as it scrolls into view.
export function StoryTimeline() {
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const steps = Array.from(list.current?.children ?? []);
    if (!("IntersectionObserver" in window)) return steps.forEach((step) => step.classList.add("is-active"));

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-active");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -18% 0px", threshold: 0.4 });

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <ol className="st-timeline" ref={list}>
      {stages.map((stage, index) => (
        <li className="st-step" key={stage.title}>
          <span className="st-step-number">0{index + 1}</span>
          <h3>{stage.title}</h3>
          <p>{stage.text}</p>
        </li>
      ))}
    </ol>
  );
}
