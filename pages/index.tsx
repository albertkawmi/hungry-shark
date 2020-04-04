import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  useGameState,
  GameState,
  GameDispatch,
  SharkState,
  MoveType,
  FoodType,
  SharkDirection,
  FoodState,
  Coords,
} from '../lib/use-game-reducer';
import { useInterval } from '../lib/use-interval';
import useHotkeys from 'use-hotkeys';

const colors = {
  black: 'black',
  brown: '#a5742b',
  green: 'lightseagreen',
  lightBlue: 'lightskyblue',
  lightBlueFaded: 'rgba(135, 206, 250, 0.25)',
  white: 'white',
  yellow: 'gold',
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

  const appWidth =
    windowWidth < windowHeight
      ? windowWidth
      : (windowHeight * windowHeight) / windowWidth;

  return appWidth;
}

export default () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
    }
    if (!hasLoaded) {
      setTimeout(() => setHasLoaded(true), 2000);
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

      <SplashScreen visible={!hasLoaded} />
      {hasMounted && <Game />}

      <style jsx global>{`
        * {
          box-sizing: border-box;
          font-family: 'Courier New', Courier, monospace;
          text-transform: uppercase;
          touch-action: manipulation !important;
          -webkit-touch-callout: none !important;
          user-select: none !important;
        }
        html,
        body {
          margin: 0;
          padding: 0;
          background-color: ${colors.black};
        }
      `}</style>
    </React.Fragment>
  );
};

const Game: React.FC = () => {
  const [state, dispatch] = useGameState() as [GameState, GameDispatch];

  useInterval(() => {
    if (state.started) {
      dispatch({ type: 'TICK' });
    }
  }, 1000);

  if (state.timeRemaining === 0) {
    return <GameOver state={state} dispatch={dispatch} />;
  }

  return (
    <div className="Game">
      <Header {...state} />
      <GameGrid state={state} dispatch={dispatch} />
      <DirectionPad state={state} dispatch={dispatch} />
      <style jsx>{`
        .Game {
          margin: 0 auto;
          height: ${getAppHeight()}px;
          width: ${getAppWidth()}px;
          display: flex;
          flex-direction: column;

          background-color: ${colors.lightBlue};
          background-image: url(/reef-bg.jpg);
          background-position: bottom;
          background-size: cover;
        }
      `}</style>
    </div>
  );
};

const SplashScreen: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div className={`SplashScreen ${visible ? '' : 'moved'}`}>
    <h1>Hungry Shark!</h1>
    <div className="circle">
      <img src="/emoji/shark.png" alt="Hungry Shark!" />
    </div>
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
        z-index: 100;
      }
      .moved {
        transform: translateX(-100vw);
      }
      h1 {
        color: ${colors.yellow};
        font-size: 3rem;
        text-align: center;
        text-shadow: 3px 3px ${colors.black};
        margin: 0;
        padding: 1rem;
      }
      .circle {
        background: ${colors.lightBlue};
        border-radius: 50%;
        padding: 3rem;
        box-shadow: 8px 8px ${colors.black};
      }
      img {
        position: relative;
        top: 8px;
        right: 4px;
      }
    `}</style>
  </div>
);

const Header: React.FC<GameState> = ({ score, timeRemaining }) => {
  return (
    <header className="Header">
      <h1>Hungry Shark!</h1>
      <span className="timer">Time: {timeRemaining}</span>
      <span className="score">Score: {score}</span>
      <style jsx>{`
        h1,
        .score,
        .timer {
          margin: 0;
          font-size: 0.875rem;
          font-weight: bold;
          text-shadow: 1px 1px ${colors.brown};
          color: ${colors.black};
        }
        .Header {
          display: flex;
          justify-content: space-between;
          padding: 1px 2px;
          background: white;
          background: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </header>
  );
};

interface StateAndDispatch {
  state: GameState;
  dispatch: GameDispatch;
}

const GameGrid: React.FC<StateAndDispatch> = ({ state, dispatch }) => {
  return (
    <main className="GameGrid">
      {!state.started && (
        <button onClick={() => dispatch({ type: 'START' })}>Ready</button>
      )}
      <Shark {...state.shark} />
      {state.food.map((f: FoodState, i) => (
        <Sealife key={f.id} {...f} />
      ))}
      <style jsx>{`
        .GameGrid {
          height: ${getAppWidth()}px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        button {
          border: 0;
          background-color: ${colors.lightBlueFaded};
          padding: 1rem;
          color: ${colors.white};
          font-size: 1.5rem;
          font-weight: bold;
          border-radius: 3px;
          opacity: 0.8;
          text-shadow: 1px 1px ${colors.black};
        }
      `}</style>
    </main>
  );
};

const GameOver: React.FC<StateAndDispatch> = ({ state, dispatch }) => {
  const [highScore, setHighScore] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    try {
      const previousHighScore = JSON.parse(
        window.localStorage.getItem('highScore')
      );
      if (state.score > previousHighScore) {
        window.localStorage.setItem('highScore', JSON.stringify(state.score));
        setHighScore(state.score);
      } else {
        setHighScore(previousHighScore);
      }
    } catch (e) {
      console.error(e);
      setHighScore(0);
    } finally {
      setTimeout(() => setShowButton(true), 1000);
    }
  }, []);

  return (
    <div className="GameOver">
      <h2>Time's up!</h2>
      <p>You scored</p>
      <p className="scored">{state.score}</p>
      <p>Points</p>
      {highScore > state.score ? (
        <h3>
          Your high score is <span className="high-score">{highScore}</span>
        </h3>
      ) : (
        <h3>That's a new high score!</h3>
      )}
      <button
        className={showButton ? 'visible' : 'hidden'}
        onClick={() => dispatch({ type: 'INIT' })}
        disabled={!showButton}
      >
        Still hungry?
      </button>
      <style jsx>{`
        .GameOver {
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
          z-index: 100;
        }
        p,
        h2,
        h3 {
          margin: 0;
          margin-bottom: 1rem;
        }
        h2,
        h3 {
          color: ${colors.white};
          text-align: center;
        }
        h2 {
          text-shadow: 3px 3px ${colors.black};
          font-size: 3rem;
        }
        h3 {
          text-shadow: 1px 1px ${colors.black};
        }
        .scored {
          font-size: 4rem;
          color: ${colors.yellow};
          text-shadow: 3px 3px ${colors.black};
          margin: 0;
          font-weight: bold;
          animation: pulse 1s infinite;
        }
        .high-score {
          color: ${colors.yellow};
        }
        button {
          border: 0;
          background-color: ${colors.yellow};
          padding: 1rem;
          color: ${colors.green};
          box-shadow: 2px 2px ${colors.black};
          text-shadow: 1px 1px ${colors.black};
          font-size: 1.5rem;
          font-weight: bold;
          border-radius: 3px;
          transition: opacity 2s ease-in;
        }
        .visible {
          opacity: 1;
        }
        .hidden {
          opacity: 0;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.9);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};

const Shark: React.FC<SharkState> = ({ x, y, facing }) => (
  <Sealife {...{ x, y, facing }} type="shark" />
);

interface SealifeProps extends Coords {
  facing?: SharkDirection;
  id?: string;
  type: FoodType | 'shark';
}

const Sealife: React.FC<SealifeProps> = ({ x, y, facing, type }) => (
  <React.Fragment>
    <img
      className={facing === 'right' ? 'facing-right' : 'facing-left'}
      src={`/emoji/${type}.png`}
      alt={type}
      style={{ top: (y * getAppWidth()) / 10, left: (x * getAppWidth()) / 10 }}
    />
    <style jsx>{`
      img {
        position: absolute;
        width: ${getWidthForType(type)}px;
        transition: top 250ms ease-out, left 250ms ease-out;
      }
      .facing-left {
        transform: scale(1);
        animation: pulseLeft 1s infinite;
      }
      .facing-right {
        transform: scale(-1, 1);
        animation: pulseRight 1s infinite;
      }
      @keyframes pulseLeft {
        0% {
          transform: scale(0.9);
        }
        50% {
          transform: scale(1);
        }
        100% {
          transform: scale(0.9);
        }
      }

      @keyframes pulseRight {
        0% {
          transform: scale(-1, 0.9);
        }
        50% {
          transform: scale(-1, 1);
        }
        100% {
          transform: scale(-1, 0.9);
        }
      }
    `}</style>
  </React.Fragment>
);

function getWidthForType(type: FoodType | 'shark') {
  const appWidth = getAppWidth();
  switch (type) {
    case 'shark':
      return appWidth / 10;
    default:
      return appWidth / 14;
  }
}

type ArrowKey = 'up' | 'down' | 'left' | 'right';

const DirectionPad: React.FC<StateAndDispatch> = ({ dispatch }) => {
  const arrowKeys: ArrowKey[] = ['up', 'down', 'left', 'right'];
  useHotkeys(keyMovement, arrowKeys);

  const move = (direction: MoveType) => (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch({ type: direction });
  };

  function keyMovement(key: ArrowKey) {
    if (key === 'up') dispatch({ type: 'MOVE_UP' });
    if (key === 'down') dispatch({ type: 'MOVE_DOWN' });
    if (key === 'left') dispatch({ type: 'MOVE_LEFT' });
    if (key === 'right') dispatch({ type: 'MOVE_RIGHT' });
  }

  const buttonSpacing = 12;
  const headerHeight = 16;
  const dPadHeight = getAppHeight() - getAppWidth() - headerHeight;
  const dPadPadding = 8;
  const buttonWidth = (dPadHeight - 3 * buttonSpacing - 2 * dPadPadding) / 2;

  return (
    <nav className="DirectionPad">
      <div>
        <button onClick={move('MOVE_UP')}>
          <img src="/emoji/up.png" alt="Move up" />
        </button>
      </div>
      <div>
        <button onClick={move('MOVE_LEFT')}>
          <img src="/emoji/left.png" alt="Move left" />
        </button>
        <button onClick={move('MOVE_DOWN')}>
          <img src="/emoji/down.png" alt="Move down" />
        </button>
        <button onClick={move('MOVE_RIGHT')}>
          <img src="/emoji/right.png" alt="Move right" />
        </button>
      </div>
      <style jsx>{`
        .DirectionPad {
          flex: 1;
          padding-top: ${buttonSpacing}px;
          padding-bottom: ${2 * buttonSpacing}px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          opacity: 0.8;
        }
        button {
          background: none;
          border: 0;
          padding: 0;
          margin: 0 ${buttonSpacing}px;
          width: ${buttonWidth}px;
          max-width: 4rem;
        }
        img {
          width: 100%;
        }
        div {
          text-align: center;
          margin-bottom: ${buttonSpacing}px;
        }
      `}</style>
    </nav>
  );
};
