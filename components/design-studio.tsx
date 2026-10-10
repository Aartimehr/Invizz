"use client";

import { useRef, useState, type FormEvent, type PointerEvent } from "react";
import { brushColours, createCustomReference, customMessage, customSizes, fabricColours, garments } from "@/lib/custom-order";
import { store, whatsappLink } from "@/lib/store";

// The drawing's own size in pixels; on screen it is scaled to fit the column.
const width = 800;
const height = 1000;

type Stroke = { colour: string; size: number; erase: boolean; points: [number, number][] };
type Ready = { reference: string; image: string; url: string };

// Draws the stroke from the given point onwards, so a stroke in progress only adds its newest piece.
function paint(context: CanvasRenderingContext2D, stroke: Stroke, from = 0) {
  const [first, ...rest] = stroke.points.slice(from);
  if (!first) return;
  context.globalCompositeOperation = stroke.erase ? "destination-out" : "source-over";
  context.strokeStyle = stroke.colour;
  context.lineWidth = stroke.size;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(first[0], first[1]);
  // A tap with no movement still leaves a dot.
  if (!rest.length) context.lineTo(first[0], first[1]);
  for (const [x, y] of rest) context.lineTo(x, y);
  context.stroke();
}

export function DesignStudio() {
  const canvas = useRef<HTMLCanvasElement>(null);
  // Kept as strokes rather than pixels so undo can replay everything but the last one.
  const strokes = useRef<Stroke[]>([]);
  const current = useRef<Stroke | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);
  const [garmentId, setGarmentId] = useState<string>(garments[0].id);
  const [fabric, setFabric] = useState(fabricColours[0]);
  const [erasing, setErasing] = useState(false);
  const [colour, setColour] = useState(brushColours[0]);
  const [size, setSize] = useState(10);
  const [error, setError] = useState("");
  const [ready, setReady] = useState<Ready | null>(null);

  const garment = garments.find((option) => option.id === garmentId) ?? garments[0];

  // Any change to the picture makes an already prepared drawing out of date.
  function changed() {
    setReady(null);
    setError("");
  }

  function redraw() {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, width, height);
    for (const stroke of strokes.current) paint(context, stroke);
    setStrokeCount(strokes.current.length);
    changed();
  }

  function position(event: PointerEvent<HTMLCanvasElement>): [number, number] {
    const box = event.currentTarget.getBoundingClientRect();
    return [((event.clientX - box.left) * width) / box.width, ((event.clientY - box.top) * height) / box.height];
  }

  function startStroke(event: PointerEvent<HTMLCanvasElement>) {
    const context = event.currentTarget.getContext("2d");
    if (!context || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    current.current = { colour, size, erase: erasing, points: [position(event)] };
    strokes.current.push(current.current);
    paint(context, current.current);
  }

  function continueStroke(event: PointerEvent<HTMLCanvasElement>) {
    const context = event.currentTarget.getContext("2d");
    if (!context || !current.current) return;
    current.current.points.push(position(event));
    paint(context, current.current, current.current.points.length - 2);
  }

  function endStroke() {
    if (!current.current) return;
    current.current = null;
    setStrokeCount(strokes.current.length);
    changed();
  }

  function undo() {
    strokes.current.pop();
    redraw();
  }

  function clear() {
    if (!window.confirm("Clear the whole drawing?")) return;
    strokes.current = [];
    redraw();
  }

  // The picture the customer saves: white page, the piece in its fabric colour, then the drawing on top.
  function exportImage() {
    const output = document.createElement("canvas");
    output.width = width;
    output.height = height;
    const context = output.getContext("2d");
    if (!context || !canvas.current) return "";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    const outline = new Path2D(garment.outline);
    context.scale(width / 400, height / 500);
    context.fillStyle = fabric.value;
    context.fill(outline);
    context.strokeStyle = "#b9b7ab";
    context.lineWidth = 1.5;
    context.stroke(outline);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.drawImage(canvas.current, 0, 0);
    return output.toDataURL("image/png");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!strokes.current.length) return setError("Draw your idea on the canvas first.");
    const image = exportImage();
    if (!image) return setError("This browser could not save the drawing. Take a screenshot of it and send that on WhatsApp instead.");

    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    const reference = ready?.reference ?? createCustomReference();
    const message = customMessage({ reference, garment: garment.name, fabric: fabric.name, size: field("size"), notes: field("notes"), name: field("name"), phone: field("phone") });
    setError("");
    setReady({ reference, image, url: whatsappLink(message) });
  }

  return (
    <div className="studio">
      <div>
        <p className="studio-tab"><span>Canvas</span></p>
        <h2>Draw and paint what<br /><em>you want to wear.</em></h2>
        <p className="studio-intro">Pick a piece, choose its fabric colour, then sketch your idea. It doesn&apos;t need to be neat; we&apos;ll ask if anything is unclear.</p>
      </div>

      <div className="studio-board">
        <div className="studio-canvas">
          <svg viewBox="0 0 400 500" aria-hidden="true">
            <path d={garment.outline} fill={fabric.value} stroke="#b9b7ab" strokeWidth="1.5" strokeDasharray="6 5" />
          </svg>
          <canvas
            ref={canvas}
            width={width}
            height={height}
            className={erasing ? "is-erasing" : undefined}
            role="img"
            aria-label={`Drawing area with a ${garment.name} outline. Draw with a finger, pen or mouse.`}
            onPointerDown={startStroke}
            onPointerMove={continueStroke}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
          />
        </div>

        <div className="studio-tools">
          <div className="tool-group">
            <span className="field-label">Piece</span>
            <div className="tool-row">
              {garments.map((option) => (
                <button className={`tool-button${option.id === garmentId ? " is-current" : ""}`} type="button" aria-pressed={option.id === garmentId} key={option.id} onClick={() => { setGarmentId(option.id); changed(); }}>
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          <div className="tool-group">
            <span className="field-label">Fabric colour: {fabric.name}</span>
            <div className="swatches">
              {fabricColours.map((option) => (
                <button className={`swatch${option.value === fabric.value ? " is-current" : ""}`} type="button" style={{ background: option.value }} aria-label={`${option.name} fabric`} aria-pressed={option.value === fabric.value} key={option.value} onClick={() => { setFabric(option); changed(); }} />
              ))}
            </div>
          </div>

          <div className="tool-group">
            <span className="field-label">Tool</span>
            <div className="tool-row">
              <button className={`tool-button${erasing ? "" : " is-current"}`} type="button" aria-pressed={!erasing} onClick={() => setErasing(false)}>Brush</button>
              <button className={`tool-button${erasing ? " is-current" : ""}`} type="button" aria-pressed={erasing} onClick={() => setErasing(true)}>Eraser</button>
            </div>
          </div>

          <div className="tool-group">
            <span className="field-label">Brush colour</span>
            <div className="swatches">
              {brushColours.map((option) => (
                <button className={`swatch${!erasing && option === colour ? " is-current" : ""}`} type="button" style={{ background: option }} aria-label={`Brush colour ${option}`} aria-pressed={!erasing && option === colour} key={option} onClick={() => { setColour(option); setErasing(false); }} />
              ))}
              <input className="swatch swatch-any" type="color" value={colour} aria-label="Any other brush colour" onChange={(event) => { setColour(event.target.value); setErasing(false); }} />
            </div>
          </div>

          <label className="tool-group">
            <span className="field-label">{erasing ? "Eraser" : "Brush"} size</span>
            <input type="range" min={2} max={70} value={size} onChange={(event) => setSize(Number(event.target.value))} />
          </label>

          <div className="tool-row">
            <button className="tool-button" type="button" disabled={!strokeCount} onClick={undo}>Undo</button>
            <button className="tool-button" type="button" disabled={!strokeCount} onClick={clear}>Clear all</button>
          </div>
        </div>
      </div>

      <form className="order-form studio-form" onSubmit={handleSubmit}>
        <p className="eyebrow">About your piece</p>

        <fieldset className="field">
          <legend className="field-label">Size</legend>
          <div className="choice-row">
            {customSizes.map((option) => (
              <label className="choice" key={option}>
                <input type="radio" name="size" value={option} required />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Full name</span>
            <input name="name" autoComplete="name" required />
          </label>
          <label className="field">
            <span className="field-label">Mobile number</span>
            <input name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[6-9][0-9]{9}" title="10-digit mobile number" required />
          </label>
        </div>

        <label className="field">
          <span className="field-label">Anything we should know? (optional)</span>
          <textarea name="notes" rows={3} maxLength={500} placeholder="The fabric you'd like, the fit, where a print or embroidery should go" />
        </label>

        {error ? <p className="studio-error" role="alert">{error}</p> : null}

        <button className="button button-dark order-submit" type="submit">
          My drawing is ready <span aria-hidden="true">↗</span>
        </button>
        <p className="order-hint">Nothing is paid at this step. We reply on WhatsApp with the price first, and you decide.</p>

        <div aria-live="polite">
          {ready ? (
            <div className="order-sent studio-ready">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ready.image} alt="Your drawing" />
              <div>
                <p className="eyebrow">Two steps left</p>
                <h3>Save it, then send it.</h3>
                <p>A WhatsApp link can&apos;t carry a picture, so save your drawing first and attach it in the chat with {store.whatsappDisplay}. Your design reference is <strong>{ready.reference}</strong>, and our reply will quote it.</p>
                <div className="tool-row">
                  <a className="button button-outline" href={ready.image} download={`invidzz-${ready.reference}.png`}>1. Save my drawing</a>
                  <a className="button button-dark" href={ready.url} target="_blank" rel="noopener noreferrer">2. Send on WhatsApp <span aria-hidden="true">↗</span></a>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}
