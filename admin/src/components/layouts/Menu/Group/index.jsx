import PropTypes from "prop-types";

// Local Imports
import { NAV_TYPE_COLLAPSE, NAV_TYPE_ITEM } from "constants/app.constant";
import { CollapsibleItem } from "./CollapsibleItem";
import { MenuItem } from "./MenuItem";

// ----------------------------------------------------------------------

export function Group({ data }) {
  return (
    <div className="pt-3">
      
      {/* <Collapse in={isOpened}> */}
        <div className="flex flex-col space-y-1.5">
          {data.map((item, idx) => {
            const key = item.id || item.path || `item-${idx}`;
            switch (item.type) {
              case NAV_TYPE_COLLAPSE:
                return <CollapsibleItem key={key} data={item} />;
              case NAV_TYPE_ITEM:
                return <MenuItem key={key} data={item} />;
              default:
                return null;
            }
          })}
        </div>
      {/* </Collapse> */}
    </div>
  );
}

Group.propTypes = {
  data: PropTypes.object,
};
