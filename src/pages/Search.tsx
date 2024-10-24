export default () => {
  return (
    <main>
      <title>Punderful Search</title>
      <section class="search-section">
        <input
          type="text"
          id="search-input"
          placeholder="Search for a pun..."
        />
      </section>
      <section id="search-results" class="pun-grid"></section>
      <script src="/scripts/search.js" />
    </main>
  );
};
