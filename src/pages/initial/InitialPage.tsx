import { useAtom } from "jotai";
import { configAtom } from "../game/hooks/useCell";
import { useNavigate } from "react-router-dom";

const Dump = () => {
  const [state, setState] = useAtom(configAtom);

  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor="vtSize">vtSize</label>
      <select
        name="vtSize"
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            vtSize: Number(e.target.value),
          }))
        }
        value={state.vtSize}
        id="vtSize">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>
      <label htmlFor="hztSize">hztSize</label>
      <select
        name="hztSize"
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            hztSize: Number(e.target.value),
          }))
        }
        value={state.hztSize}
        id="hztSize">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>
      <label htmlFor="howManyMines">howManyMines</label>
      <select
        name="howManyMines"
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            howManyMines: Number(e.target.value),
          }))
        }
        value={state.howManyMines}
        id="howManyMines">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="30">30</option>
        <option value="35">35</option>
        <option value="40">40</option>
      </select>
      <button onClick={() => navigate("/game")}>go</button>
    </div>
  );
};

export default Dump;
