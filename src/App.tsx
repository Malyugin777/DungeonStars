import { useState, useEffect } from 'react'
import { getWebApp } from './tg-webapp'
import './App.css'
import mageMale from './assets/chars/mage_male.png'
import archerMale from './assets/chars/archer_male.png'
import rogueMale from './assets/chars/rogue_male.png'
import knightMale from './assets/chars/knight_male.png'

type Tab = 'home' | 'base' | 'quests'

type ClassKey = 'mage' | 'archer' | 'knight' | 'rogue'
const CLASS_KEYS: ClassKey[] = ['mage', 'archer', 'knight', 'rogue']

type Gender = 'male' | 'female'
type SkinTone = 'light' | 'medium' | 'dark'
type HairStyle = 'short' | 'medium' | 'hood'

interface CharacterAppearance {
  classKey: ClassKey
  gender: Gender
  skinTone: SkinTone
  hairStyle: HairStyle
}

interface Stats {
  hp: number
  attack: number
  defense: number
  critChance: number
  critDamage: number
  evade: number
}

type BattleResult = 'win' | 'lose' | 'draw'

const CLASS_CONFIG: Record<
  ClassKey,
  { name: string; role: string; emoji: string; bodyGradient: string }
> = {
  mage: {
    name: 'Маг',
    role: 'Дальний урон',
    emoji: '🧙‍♂️',
    bodyGradient: 'linear-gradient(180deg, #7c5cff, #c095ff)',
  },
  archer: {
    name: 'Лучник',
    role: 'Криты и точность',
    emoji: '🏹',
    bodyGradient: 'linear-gradient(180deg, #4fd26b, #9af5aa)',
  },
  knight: {
    name: 'Рыцарь',
    role: 'Танк и защита',
    emoji: '🛡️',
    bodyGradient: 'linear-gradient(180deg, #ff8a3c, #ffd65c)',
  },
  rogue: {
    name: 'Даггерщик',
    role: 'Увороты и криты',
    emoji: '🗡️',
    bodyGradient: 'linear-gradient(180deg, #ff5c8a, #ffb3c9)',
  },
}

const CLASS_STATS: Record<ClassKey, Stats> = {
  mage: {
    hp: 80,
    attack: 22,
    defense: 4,
    critChance: 15,
    critDamage: 170,
    evade: 5,
  },
  archer: {
    hp: 90,
    attack: 18,
    defense: 5,
    critChance: 22,
    critDamage: 160,
    evade: 8,
  },
  knight: {
    hp: 120,
    attack: 14,
    defense: 10,
    critChance: 8,
    critDamage: 150,
    evade: 4,
  },
  rogue: {
    hp: 85,
    attack: 19,
    defense: 5,
    critChance: 25,
    critDamage: 180,
    evade: 14,
  },
}

function getRandomEnemyClass(playerClassKey: ClassKey): ClassKey {
  const available = CLASS_KEYS.filter((k) => k !== playerClassKey)
  const index = Math.floor(Math.random() * available.length)
  return available[index]
}

const CLASS_SPRITES: Record<ClassKey, { male: string; female: string }> = {
  mage: {
    male: mageMale,
    female: mageMale,
  },
  archer: {
    male: archerMale,
    female: archerMale,
  },
  rogue: {
    male: rogueMale,
    female: rogueMale,
  },
  knight: {
    male: knightMale,
    female: knightMale,
  },
}

const SKIN_COLORS: Record<SkinTone, string> = {
  light: '#f5e2c0',
  medium: '#d9b38c',
  dark: '#8c5a3c',
}

const HAIR_COLORS: Record<HairStyle, string> = {
  short: '#3c2b20',
  medium: '#2c1b40',
  hood: '#2b2240',
}

/* --------- ЭКРАН СОЗДАНИЯ ПЕРСОНАЖА --------- */

function CharacterCreationScreen({
  onFinish,
}: {
  onFinish: (ch: CharacterAppearance) => void
}) {
  const [classKey, setClassKey] = useState<ClassKey>('mage')
  const [gender, setGender] = useState<Gender>('male')
  const [skinTone, setSkinTone] = useState<SkinTone>('light')
  const [hairStyle, setHairStyle] = useState<HairStyle>('short')

  const handleCreate = () => {
    onFinish({ classKey, gender, skinTone, hairStyle })
  }

  return (
    <div className="creator-screen">
      <div className="creator-title">Создай персонажа</div>

      <div className="card">
        <div className="creator-section-title">Класс</div>
        <div className="choice-row">
          {(Object.keys(CLASS_CONFIG) as ClassKey[]).map((key) => {
            const cfg = CLASS_CONFIG[key]
            const active = key === classKey
            return (
              <button
                key={key}
                className={`choice-pill ${active ? 'active' : ''}`}
                onClick={() => setClassKey(key)}
              >
                <span className="choice-emoji">{cfg.emoji}</span>
                <span className="choice-texts">
                  <span className="choice-main">{cfg.name}</span>
                  <span className="choice-sub">{cfg.role}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="card">
        <div className="creator-section-title">Пол</div>
        <div className="choice-row">
          <button
            className={`choice-pill small ${
              gender === 'male' ? 'active' : ''
            }`}
            onClick={() => setGender('male')}
          >
            <span className="choice-main">Мужской</span>
          </button>
          <button
            className={`choice-pill small ${
              gender === 'female' ? 'active' : ''
            }`}
            onClick={() => setGender('female')}
          >
            <span className="choice-main">Женский</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="creator-section-title">Цвет кожи</div>
        <div className="color-row">
          {(Object.keys(SKIN_COLORS) as SkinTone[]).map((tone) => (
            <button
              key={tone}
              className={`color-dot ${skinTone === tone ? 'active' : ''}`}
              style={{ backgroundColor: SKIN_COLORS[tone] }}
              onClick={() => setSkinTone(tone)}
            />
          ))}
        </div>

        <div className="creator-section-title" style={{ marginTop: 10 }}>
          Прическа / капюшон
        </div>
        <div className="choice-row">
          <button
            className={`choice-pill small ${
              hairStyle === 'short' ? 'active' : ''
            }`}
            onClick={() => setHairStyle('short')}
          >
            <span className="choice-main">Короткие</span>
          </button>
          <button
            className={`choice-pill small ${
              hairStyle === 'medium' ? 'active' : ''
            }`}
            onClick={() => setHairStyle('medium')}
          >
            <span className="choice-main">Средние</span>
          </button>
          <button
            className={`choice-pill small ${
              hairStyle === 'hood' ? 'active' : ''
            }`}
            onClick={() => setHairStyle('hood')}
          >
            <span className="choice-main">Капюшон</span>
          </button>
        </div>
      </div>

      <button className="find-match-button" onClick={handleCreate}>
        Создать персонажа
      </button>

      <div className="creator-hint">
        Выбор можно будет менять позже в берлоге.
      </div>
    </div>
  )
}

/* --------- ЭКРАН ПЕРСОНАЖА (HOME) --------- */

function CharacterScreen({
  character,
  onFindMatch,
  lastResult,
}: {
  character: CharacterAppearance
  onFindMatch: () => void
  lastResult: BattleResult | null
}) {
  const cls = CLASS_CONFIG[character.classKey]

  const sprite =
    CLASS_SPRITES[character.classKey][character.gender]

  return (
    <div className="screen">
      <div className="character-wrapper">
        <div className="character-sprite-wrapper">
          <img src={sprite} className="character-sprite" />
        </div>

        <div className="character-label">
          {cls.name} · {character.gender === 'male' ? 'М' : 'Ж'}
        </div>

        {lastResult && (
          <div className="last-battle">
            {lastResult === 'win'
              ? 'Последний бой: 🏆 Победа'
              : lastResult === 'lose'
              ? 'Последний бой: 💀 Поражение'
              : 'Последний бой: 🤝 Ничья'}
          </div>
        )}

        <button className="find-match-button" onClick={onFindMatch}>
          Найти бой
        </button>
      </div>
    </div>
  )
}

/* --------- ЭКРАН БОЯ --------- */

function BattleScreen({
  character,
  onExit,
}: {
  character: CharacterAppearance
  onExit: (result: BattleResult) => void
}) {
  const [enemyClassKey, setEnemyClassKey] = useState<ClassKey>(() =>
    getRandomEnemyClass(character.classKey)
  )
  const [enemyGender, setEnemyGender] = useState<Gender>('male')

  const playerStats = CLASS_STATS[character.classKey]
  const enemyStats = CLASS_STATS[enemyClassKey]

  const playerSprite =
    CLASS_SPRITES[character.classKey][character.gender]
  const enemySprite =
    CLASS_SPRITES[enemyClassKey][enemyGender]

  const [playerHP, setPlayerHP] = useState(playerStats.hp)
  const [enemyHP, setEnemyHP] = useState(enemyStats.hp)
  const [round, setRound] = useState(1)
  const [log, setLog] = useState<string[]>([])
  const [isFinished, setIsFinished] = useState(false)
  const [result, setResult] = useState<BattleResult | null>(null)

  // анимации
  const [playerHitAnim, setPlayerHitAnim] = useState(false)
  const [enemyHitAnim, setEnemyHitAnim] = useState(false)
  const [playerDamageText, setPlayerDamageText] = useState<string | null>(null)
  const [enemyDamageText, setEnemyDamageText] = useState<string | null>(null)

  function addLog(message: string) {
    setLog((prev) => [`Раунд ${round}: ${message}`, ...prev].slice(0, 8))
  }

  function performHit(
    attacker: Stats,
    defender: Stats,
    defenderHP: number,
    attackerName: string,
    defenderName: string
  ): { newHP: number; text: string; damage: number; isCrit: boolean } {
    // шанс, что защитник увернётся
    const evadeRoll = Math.random() * 100
    if (evadeRoll < defender.evade) {
      return {
        newHP: defenderHP,
        text: `${defenderName} уклонился от удара!`,
        damage: 0,
        isCrit: false,
      }
    }

    // базовый урон
    let dmg =
      attacker.attack -
      Math.round(defender.defense * 0.3) +
      Math.random() * 4
    if (dmg < 3) dmg = 3

    // крит
    const critRoll = Math.random() * 100
    let isCrit = false
    if (critRoll < attacker.critChance) {
      isCrit = true
      dmg = Math.round((dmg * attacker.critDamage) / 100)
    } else {
      dmg = Math.round(dmg)
    }

    const newHP = Math.max(0, defenderHP - dmg)
    const text = isCrit
      ? `${attackerName} наносит КРИТ ${dmg} урона по ${defenderName}.`
      : `${attackerName} наносит ${dmg} урона по ${defenderName}.`

    return { newHP, text, damage: dmg, isCrit }
  }

  function handleTurn() {
    if (isFinished) return

    // ход игрока
    const playerHit = performHit(
      playerStats,
      enemyStats,
      enemyHP,
      'Ты',
      'Бот'
    )
    setEnemyHP(playerHit.newHP)

    if (playerHit.damage > 0) {
      setEnemyHitAnim(true)
      setEnemyDamageText(
        playerHit.isCrit ? `✦-${playerHit.damage}` : `-${playerHit.damage}`
      )
      setTimeout(() => {
        setEnemyHitAnim(false)
        setEnemyDamageText(null)
      }, 400)
    }

    if (playerHit.newHP <= 0) {
      setIsFinished(true)
      setResult('win')
      addLog(playerHit.text + ' Бот повержен.')
      return
    }

    // ход бота
    const enemyHit = performHit(
      enemyStats,
      playerStats,
      playerHP,
      'Бот',
      'Ты'
    )
    setPlayerHP(enemyHit.newHP)

    if (enemyHit.damage > 0) {
      setPlayerHitAnim(true)
      setPlayerDamageText(
        enemyHit.isCrit ? `✦-${enemyHit.damage}` : `-${enemyHit.damage}`
      )
      setTimeout(() => {
        setPlayerHitAnim(false)
        setPlayerDamageText(null)
      }, 400)
    }

    if (enemyHit.newHP <= 0) {
      setIsFinished(true)
      setResult('lose')
      addLog(playerHit.text + ' ' + enemyHit.text + ' Ты пал в бою.')
      return
    }

    addLog(playerHit.text + ' ' + enemyHit.text)
    setRound((prev) => prev + 1)
  }

  function handleRestart() {
    setPlayerHP(playerStats.hp)
    setEnemyHP(enemyStats.hp)
    setRound(1)
    setLog([])
    setIsFinished(false)
    setResult(null)
    setPlayerHitAnim(false)
    setEnemyHitAnim(false)
    setPlayerDamageText(null)
    setEnemyDamageText(null)
    setEnemyClassKey(getRandomEnemyClass(character.classKey))
    setEnemyGender('male')
  }

  function handleExit() {
    if (!result) return
    onExit(result)
  }

  return (
    <div className="screen">
      <div className="card battle-card">
        <div className="card-title">Бой 1×1</div>

        <div className="battle-avatars">
          <div className="battle-avatar player-avatar">
            <img src={playerSprite} className="battle-avatar-img" />
          </div>
          <div className="battle-avatar enemy-avatar">
            <img
              src={enemySprite}
              className="battle-avatar-img enemy-flip"
            />
          </div>
        </div>

        <div className="battle-layout">
          <div className="battle-row">
            <div className={`battle-side ${playerHitAnim ? 'hit' : ''}`}>
              <div className="battle-name">Ты</div>
              <div className="battle-hp-bar">
                <div
                  className="battle-hp-fill player"
                  style={{ width: `${(playerHP / playerStats.hp) * 100}%` }}
                />
              </div>
              <div className="battle-hp-value">
                {playerHP} / {playerStats.hp}
              </div>
              {playerDamageText && (
                <div className="damage-float player-damage">
                  {playerDamageText}
                </div>
              )}
            </div>

            <div className={`battle-side ${enemyHitAnim ? 'hit' : ''}`}>
              <div className="battle-name">Бот</div>
              <div className="battle-hp-bar">
                <div
                  className="battle-hp-fill enemy"
                  style={{ width: `${(enemyHP / enemyStats.hp) * 100}%` }}
                />
              </div>
              <div className="battle-hp-value">
                {enemyHP} / {enemyStats.hp}
              </div>
              {enemyDamageText && (
                <div className="damage-float enemy-damage">
                  {enemyDamageText}
                </div>
              )}
            </div>
          </div>

          <div className="battle-buttons">
            <button
              className="primary-button"
              onClick={handleTurn}
              disabled={isFinished}
            >
              Ход
            </button>
            <button className="secondary-button" onClick={handleRestart}>
              Рестарт
            </button>
          </div>

          <div className="battle-log">
            <div className="battle-log-title">Лог боя</div>
            {log.length === 0 ? (
              <div className="battle-log-empty">
                Нажми «Ход», чтобы начать раунд.
              </div>
            ) : (
              log.map((line, idx) => (
                <div key={idx} className="battle-log-line">
                  {line}
                </div>
              ))
            )}
          </div>
        </div>

        {isFinished && result && (
          <BattleResultModal
            result={result}
            playerName="Ты"
            enemyName={CLASS_CONFIG[enemyClassKey].name}
            playerHpLeft={Math.max(playerHP, 0)}
            enemyHpLeft={Math.max(enemyHP, 0)}
            roundsCount={Math.max(round - 1, 1)}
            coinsChange={0}
            ratingChange={0}
            onPlayAgain={handleRestart}
            onBackToMenu={handleExit}
          />
        )}
      </div>
    </div>
  )
}

/* --------- ПРОЧИЕ ЭКРАНЫ --------- */

function BaseScreen() {
  return (
    <div className="screen">
      <div className="card">
        <div className="card-title">Берлога / Инвентарь</div>
        <p className="card-text">
          Здесь позже будут:
          <br />
          • пещера-база
          <br />
          • инвентарь, шмот
          <br />
          • апгрейды и декор
        </p>
      </div>
    </div>
  )
}

function QuestsScreen() {
  return (
    <div className="screen">
      <div className="card">
        <div className="card-title">Задания / Данж</div>
        <p className="card-text">
          Тут появятся ежедневки и вход в данж:
          <br />
          • «сыграй X боёв»
          <br />
          • «пройди данж»
          <br />
          • награды за активность
        </p>
      </div>
    </div>
  )
}

/* --------- КОРНЕВОЙ КОМПОНЕНТ --------- */
/* --------- КОРНЕВОЙ КОМПОНЕНТ --------- */

function App() {
  // Инициализация Telegram WebApp
  useEffect(() => {
    const tg = getWebApp()
    if (!tg) return

    tg.ready()
    tg.expand()
  }, [])

  // Локальное состояние игры
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [character, setCharacter] = useState<CharacterAppearance | null>(null)
  const [isInBattle, setIsInBattle] = useState(false)
  const [lastResult, setLastResult] = useState<BattleResult | null>(null)

  function handleStartBattle() {
    if (!character) return
    setIsInBattle(true)
  }

  function handleBattleEnd(result: BattleResult) {
    setIsInBattle(false)
    setLastResult(result)
  }

  return (
    <div className="app-root">
      <div className="game-container">
        <header className="game-header">
          <div className="logo-block">
            <span className="logo-pill">BETA</span>
            <span className="logo-text">Dungeon Stars</span>
          </div>
          <div className="wallet-block">
            <span>💰 0</span>
            <span>⭐ 0</span>
          </div>
        </header>

        <main>
          {!character ? (
            <CharacterCreationScreen onFinish={setCharacter} />
          ) : (
            <>
              {activeTab === 'home' &&
                (isInBattle ? (
                  <BattleScreen
                    character={character}
                    onExit={handleBattleEnd}
                  />
                ) : (
                  <CharacterScreen
                    character={character}
                    onFindMatch={handleStartBattle}
                    lastResult={lastResult}
                  />
                ))}

              {activeTab === 'base' && !isInBattle && <BaseScreen />}
              {activeTab === 'quests' && !isInBattle && <QuestsScreen />}
            </>
          )}
        </main>

        {character && !isInBattle && (
          <nav className="bottom-nav">
            <button
              className={`nav-button ${
                activeTab === 'home' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('home')}
            >
              Бой
            </button>
            <button
              className={`nav-button ${
                activeTab === 'base' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('base')}
            >
              Берлога
            </button>
            <button
              className={`nav-button ${
                activeTab === 'quests' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('quests')}
            >
              Задания
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}

export default App


/* --------- ПОПАП РЕЗУЛЬТАТА БОЯ --------- */

interface BattleResultView {
  result: BattleResult
  playerName: string
  enemyName: string
  playerHpLeft: number
  enemyHpLeft: number
  roundsCount: number
  coinsChange?: number
  ratingChange?: number
}

interface ResultModalProps extends BattleResultView {
  onPlayAgain: () => void
  onBackToMenu: () => void
}

function BattleResultModal({
  result,
  playerName,
  enemyName,
  playerHpLeft,
  enemyHpLeft,
  roundsCount,
  coinsChange = 0,
  ratingChange = 0,
  onPlayAgain,
  onBackToMenu,
}: ResultModalProps) {
  let title = ''
  let subtitle = ''

  if (result === 'win') {
    title = 'Победа!'
    subtitle = 'Ты одолел противника.'
  } else if (result === 'lose') {
    title = 'Поражение...'
    subtitle = 'В следующий раз будет лучше.'
  } else {
    title = 'Ничья'
    subtitle = 'Силы оказались равны.'
  }

  const resultClass =
    result === 'win'
      ? 'result-win'
      : result === 'lose'
      ? 'result-lose'
      : 'result-draw'

  return (
    <div className="result-overlay">
      <div className={`result-modal ${resultClass}`}>
        <div className="result-title">{title}</div>
        <div className="result-subtitle">{subtitle}</div>

        <div className="result-heroes">
          <div className="result-hero">
            <div className="result-hero-name">{playerName}</div>
            <div className="result-hero-stat">
              Осталось HP:{' '}
              {playerHpLeft > 0 ? playerHpLeft : 'Пал в бою'}
            </div>
          </div>

          <div className="result-hero">
            <div className="result-hero-name">{enemyName}</div>
            <div className="result-hero-stat">
              Осталось HP:{' '}
              {enemyHpLeft > 0 ? enemyHpLeft : 'Пал в бою'}
            </div>
          </div>
        </div>

        <div className="result-summary">Ходов: {roundsCount}</div>

        <div className="result-rewards">
          <div>
            Монеты:{' '}
            {coinsChange >= 0 ? `+${coinsChange}` : coinsChange}
          </div>
          <div>
            Рейтинг:{' '}
            {ratingChange >= 0 ? `+${ratingChange}` : ratingChange}
          </div>
        </div>

        <div className="result-buttons">
          <button className="result-btn primary" onClick={onPlayAgain}>
            {result === 'lose' ? 'Попробовать снова' : 'Сразиться ещё раз'}
          </button>
          <button className="result-btn secondary" onClick={onBackToMenu}>
            Вернуться в меню
          </button>
        </div>
      </div>
    </div>
  )
}
