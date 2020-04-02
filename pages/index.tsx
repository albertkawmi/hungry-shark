import React from 'react';
import Head from 'next/head';

const colors = {
  black: 'black',
  brown: '#a5742b',
  green: 'lightseagreen',
  lightBlue: 'lightskyblue',
  white: 'white',
};

const isServer = typeof window === 'undefined';

function getAppHeight() {
  if (isServer) {
    return 0;
  }
  return window.innerHeight;
}

function getAppWidth() {
  if (isServer) return 0;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowRatio =
    windowWidth < windowHeight
      ? windowWidth / windowHeight
      : windowHeight / windowWidth;
  const appWidth = windowRatio * windowHeight;
  return appWidth;
}

export default () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    if (!hasMounted) {
      setTimeout(() => setHasMounted(true), 2000);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no"
        />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Hungry Shark! Eat as much as you can!"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#87CEFA" />
        <meta name="msapplication-TileColor" content="#87cefa" />
        <meta name="theme-color" content="#87cefa" />
        <title>Hungry Shark!</title>
      </Head>

      <SplashScreen visible={!hasMounted} />
      {!isServer && <Game />}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        html,
        body {
          margin: 0;
          padding: 0;
          font-family: 'Courier New', Courier, monospace;
          text-transform: uppercase;
          background-color: ${colors.black};
        }
      `}</style>
    </React.Fragment>
  );
};

const Game: React.FC = () => {
  return (
    <div className="Game">
      <Header />
      <GameGrid />
      <DirectionPad onMove={d => console.log(d)} />
      <Footer />
      <style jsx>{`
        .Game {
          margin: 0 auto;
          height: ${getAppHeight()}px;
          width: ${getAppWidth()}px;
          display: flex;
          flex-direction: column;

          background-color: ${colors.lightBlue};
        }
      `}</style>
    </div>
  );
};

const SplashScreen: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div className={`SplashScreen ${visible ? '' : 'moved'}`}>
    <h1>Hungry Shark!</h1>
    <img src="/emoji/shark.png" alt="Hungry Shark!" />
    <style jsx>{`
      .SplashScreen {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: ${colors.green};
        transition: transform 250ms linear;
      }
      .moved {
        transform: translateX(-100vw);
      }
      h1 {
        color: ${colors.white};
        font-size: 2rem;
        text-align: center;
        text-shadow: 1px 1px ${colors.black};
      }
      img {
        background: ${colors.lightBlue};
        padding: 3rem;
        border-radius: 50%;
      }
    `}</style>
  </div>
);

const Header = () => {
  return (
    <header className="Header">
      <h1>Hungry Shark!</h1>
      <span>Score: 0</span>
      <style jsx>{`
        h1,
        span {
          margin: 0;
          font-size: 0.875rem;
          text-shadow: 1px 1px ${colors.lightBlue};
        }
        .Header {
          display: flex;
          justify-content: space-between;
          padding: 1px 2px;
          background-color: ${colors.white};
          border-bottom: dotted 2px ${colors.lightBlue};
        }
      `}</style>
    </header>
  );
};

const GameGrid = () => {
  return (
    <main className="GameGrid">
      <style jsx>{`
        .GameGrid {
          height: ${getAppWidth()}px;
        }
      `}</style>
    </main>
  );
};

enum Direction {
  UP = 'UP',
  LEFT = 'LEFT',
  DOWN = 'DOWN',
  RIGHT = 'RIGHT',
}

const DirectionPad: React.FC<{ onMove: (direction: Direction) => void }> = ({
  onMove,
}) => {
  return (
    <nav className="DirectionPad">
      <div>
        <img
          role="button"
          onClick={() => onMove(Direction.UP)}
          src="/emoji/up.png"
          alt="Up"
        />
      </div>
      <div>
        <img
          role="button"
          onClick={() => onMove(Direction.LEFT)}
          src="/emoji/left.png"
          alt="Left"
        />
        <img
          role="button"
          onClick={() => onMove(Direction.DOWN)}
          src="/emoji/down.png"
          alt="Down"
        />
        <img
          role="button"
          onClick={() => onMove(Direction.RIGHT)}
          src="/emoji/right.png"
          alt="Right"
        />
      </div>
      <style jsx>{`
        .DirectionPad {
          flex: 1;
          padding-top: 0.5rem;
          background-color: ${colors.brown};
        }
        img {
          width: ${getAppWidth() / 10}px;
          margin: 4px 4px 0 4px;
        }
        div {
          text-align: center;
        }
      `}</style>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="Footer">
      <button>High Scores</button>
      <button>Play/Pause</button>
      <button>Start Again</button>
      <button>Game Settings</button>
      <style jsx>{`
        .Footer {
          background-color: ${colors.white};
        }
      `}</style>
    </footer>
  );
};
