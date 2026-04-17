/** Fixed FAB aligned to max-width mobile frame, above bottom nav. */
const Fab = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-2xl font-light text-white shadow-ae-card hover:bg-sky-600"
      style={{
        bottom:
          "calc(var(--bottom-nav-height) + var(--bottom-nav-gap) + env(safe-area-inset-bottom) + 8px)",
        right: "max(1rem, calc(50vw - 215px + 16px))",
      }}
      aria-label="New capture"
    >
      +
    </button>
  );
};

export default Fab;
