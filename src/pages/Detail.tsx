export default () => {
  return (
    <main>
      <title>Punderful Detail</title>
      <div class="pun-grid">
        <section id="pun-detail-section" class="pun-box">
          <div class="pun-text" id="pun-detail-text"></div>
          <div class="heart">🤍</div>
        </section>
      </div>
      <section id="similar-puns-section">
        <h2>Similar Puns</h2>
        <div id="similar-puns-container" class="pun-container pun-grid"></div>
      </section>
      <script src="/scripts/detail.js" />
    </main>
  );
};
