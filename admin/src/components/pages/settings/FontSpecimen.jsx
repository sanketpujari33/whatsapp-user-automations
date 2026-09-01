import clsx from "clsx";

export function FontSpecimen({
  headingFont,
  bodyFont,
  headingWeight,
  className,
}) {
  return (
    <div className={clsx("space-y-6", className)}>
      <div>
        <h1
          className="text-display-lg mb-2"
          style={{
            fontFamily: headingFont || "Hanken Grotesk",
            fontWeight: headingWeight || "700",
          }}
        >
          The quick brown fox
        </h1>
        <p
          className="text-body-lg text-on-surface-variant leading-relaxed"
          style={{ fontFamily: bodyFont || "Inter" }}
        >
          Jumps over the lazy dog. Designers use this sentence to preview fonts
          across different weights and styles.
        </p>
      </div>
      <hr className="border-outline-variant" />
      <div>
        <h3 className="text-headline-md mb-2">Administrative Dashboard</h3>
        <p className="text-body-md mb-4">
          Effective communication relies on clear hierarchies. Body text should
          be legible and well-spaced to reduce cognitive load.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-surface-container px-3 py-1 rounded-full font-label-md text-label-md">
            TAG_LABEL
          </span>
          <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md">
            ACTIVE_STATE
          </span>
          <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full font-label-md text-label-md">
            ERROR_ALERT
          </span>
        </div>
      </div>
      <div className="p-4 bg-surface rounded-lg border border-dashed border-outline">
        <p className="text-xs text-on-surface-variant italic mb-2">
          Font Pairing Test:
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded bg-primary-fixed flex items-center justify-center text-on-primary-fixed text-lg font-bold"
              style={{ fontFamily: headingFont || "Hanken Grotesk" }}
            >
              Aa
            </div>
            <div>
              <p
                className="text-headline-sm"
                style={{ fontFamily: headingFont || "Hanken Grotesk" }}
              >
                Heading Sample
              </p>
              <p className="text-xs text-on-surface-variant">
                Weight: {headingWeight || "700"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed text-lg font-bold"
              style={{ fontFamily: bodyFont || "Inter" }}
            >
              Bb
            </div>
            <div>
              <p
                className="text-body-lg"
                style={{ fontFamily: bodyFont || "Inter" }}
              >
                Body Text Sample
              </p>
              <p className="text-xs text-on-surface-variant">
                Weight: 400 / Regular
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
