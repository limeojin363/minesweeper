import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { initialSettingAtom } from "../../hooks/useGame";

const InitialPage = () => {
  const [state, setState] = useAtom(initialSettingAtom);

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
      </select>
      <button onClick={() => navigate("/game")}>go</button>
    </div>
  );
};

export default InitialPage;
