export default () => {
  return (
    <section class="new-pun-section">
      <title>Punderful - Create a New Pun</title>
      <h1>Create a New Pun</h1>
      <form id="new-pun-form">
        <textarea
          id="pun-input"
          placeholder="Enter your pun here..."
          rows={5}
        ></textarea>
        <button type="button" id="submit-pun">
          Submit Pun
        </button>
      </form>
      <div id="pun-preview-container">
        <h2>Preview</h2>
        <div id="pun-preview"></div>
      </div>
      <script src="/scripts/new.js" />
    </section>
  );
};
