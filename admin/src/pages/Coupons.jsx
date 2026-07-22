import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  SquarePen,
  Trash2,
  Search,
  TicketPercent,
} from "lucide-react";
import "./Coupons.css";

const API_URL = "http://localhost:5000";

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/coupons/get`);
      const data = await response.json();

      if (data.success) {
        setCoupons(data.data);
        setFilteredCoupons(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    const result = coupons.filter((coupon) =>
      coupon.code.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredCoupons(result);
  }, [search, coupons]);

  const deleteCoupon = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this coupon?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/coupons/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchCoupons();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="coupon-loading">
        Loading Coupons...
      </div>
    );
  }
    return (
    <div className="coupons-page">

      <div className="coupons-header">

        <div>
          <h1>Discount Coupons</h1>
          
        </div>
       
        <Link
  to="/coupons/add"
  className="add-coupon-btn"
>
  <Plus size={18} />
  Add Coupon
</Link>

      </div>

      <div className="coupon-toolbar">

        <div className="coupon-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search coupon..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      <div className="coupon-table-wrapper">

        <table className="coupon-table">

          <thead>

            <tr>

              <th>Coupon</th>

              <th>Type</th>

              <th>Value</th>

              <th>Min Order</th>

              <th>Max Discount</th>

              <th>Status</th>

              <th>Visibility</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredCoupons.length === 0 ? (

              <tr>

                <td colSpan="8">

                  No Coupons Found

                </td>

              </tr>

            ) : (

              filteredCoupons.map((coupon) => (

                <tr key={coupon.id}>

                  <td>

                    <div className="coupon-code">

                     

                      <span>
                        {coupon.code}
                      </span>

                    </div>

                  </td>

                  <td>

                    {coupon.discount_type ===
                    "percentage"
                      ? "Percentage"
                      : "Fixed"}

                  </td>

                  <td>

                    {coupon.discount_type ===
                    "percentage"
                      ? `${coupon.discount_value}%`
                      : `₹${coupon.discount_value}`}

                  </td>

                  <td>

                    ₹{coupon.min_order}

                  </td>

                  <td>

                    {coupon.max_discount
                      ? `₹${coupon.max_discount}`
                      : "-"}

                  </td>

                  <td>

                    <span
                      className={
                        coupon.is_active
                          ? "status active"
                          : "status inactive"
                      }
                    >
                      {coupon.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                  <td>

                    {coupon.hidden
                      ? "Hidden"
                      : "Visible"}

                  </td>

                  <td>

                    <div className="coupon-actions">

                      <Link
                        to={`/coupons/edit/${coupon.id}`}
                        className="edit-btn"
                      >
                        <SquarePen size={18} />
                      </Link>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteCoupon(
                            coupon.id
                          )
                        }
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Coupons;