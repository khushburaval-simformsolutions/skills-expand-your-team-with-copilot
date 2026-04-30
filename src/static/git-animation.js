/**
 * Animated Git-style branch lines background.
 * Draws slowly scrolling commit nodes and branch lines on a canvas
 * positioned behind the main page content.
 */
(function () {
  const canvas = document.getElementById("git-branches-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // School colors: shades of lime green at low opacity
  const BRANCH_COLORS = [
    "#2d8c2d",
    "#4caf50",
    "#1a5e1a",
    "#76c442",
    "#39c039",
    "#56bb2e",
  ];

  const LANE_WIDTH = 130;
  const COMMIT_SPACING = 90;
  const NODE_RADIUS = 5;
  const LINE_ALPHA = 0.10;
  const NODE_ALPHA = 0.18;
  const SCROLL_SPEED = 0.5; // pixels per frame

  let lanes = [];
  let scrollY = 0;
  let animFrameId;
  let totalVirtualHeight;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    totalVirtualHeight = canvas.height * 4;
    buildLanes();
  }

  function buildLanes() {
    const count = Math.ceil(canvas.width / LANE_WIDTH) + 1;
    lanes = [];
    for (let i = 0; i < count; i++) {
      lanes.push({
        x: i * LANE_WIDTH + LANE_WIDTH / 2,
        color: BRANCH_COLORS[i % BRANCH_COLORS.length],
        commits: buildCommits(),
        // Every other lane has a merge connection to the next lane
        hasMerge: i % 3 === 1,
        mergeY: Math.random() * totalVirtualHeight,
      });
    }
  }

  function buildCommits() {
    const commits = [];
    let y = Math.random() * COMMIT_SPACING;
    while (y < totalVirtualHeight) {
      commits.push(y);
      y += COMMIT_SPACING * (0.7 + Math.random() * 0.9);
    }
    return commits;
  }

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lanes.forEach((lane, i) => {
      const nextLane = lanes[i + 1];

      // Draw vertical branch line
      ctx.strokeStyle = lane.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = LINE_ALPHA;
      ctx.beginPath();
      ctx.moveTo(lane.x, 0);
      ctx.lineTo(lane.x, canvas.height);
      ctx.stroke();

      // Draw commit nodes and optional branch connectors
      lane.commits.forEach((rawY) => {
        const y =
          ((rawY - scrollY) % totalVirtualHeight + totalVirtualHeight) %
            totalVirtualHeight -
          50;

        if (y < -20 || y > canvas.height + 20) return;

        // Commit node (filled circle)
        ctx.fillStyle = lane.color;
        ctx.globalAlpha = NODE_ALPHA;
        ctx.beginPath();
        ctx.arc(lane.x, y, NODE_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Outer ring on the commit node
        ctx.strokeStyle = lane.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = LINE_ALPHA;
        ctx.beginPath();
        ctx.arc(lane.x, y, NODE_RADIUS + 4, 0, Math.PI * 2);
        ctx.stroke();

        // Draw a diagonal branch-off connector to the adjacent lane
        if (nextLane && lane.hasMerge) {
          const mergeScreenY =
            ((lane.mergeY - scrollY) % totalVirtualHeight +
              totalVirtualHeight) %
              totalVirtualHeight -
            50;
          if (Math.abs(y - mergeScreenY) < 5) {
            ctx.strokeStyle = lane.color;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = LINE_ALPHA * 1.5;
            ctx.beginPath();
            ctx.moveTo(lane.x, y);
            ctx.bezierCurveTo(
              lane.x + 30,
              y,
              nextLane.x - 30,
              y + 50,
              nextLane.x,
              y + 50
            );
            ctx.stroke();
          }
        }
      });
    });

    ctx.globalAlpha = 1;

    scrollY += SCROLL_SPEED;
    if (scrollY >= totalVirtualHeight) scrollY = 0;

    animFrameId = requestAnimationFrame(drawFrame);
  }

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      cancelAnimationFrame(animFrameId);
      resize();
      drawFrame();
    }, 150);
  });

  resize();
  drawFrame();
})();
