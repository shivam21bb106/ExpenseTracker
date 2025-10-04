import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ManageExpense = () => {
    const navigate = useNavigate();
    const userid = localStorage.getItem("userId");
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editExpense, setEditExpense] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (!userid) {
            navigate("/login");
            return;
        }
        fetchExpenses();

    }, []);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const r = await fetch(`http://127.0.0.1:8000/api/manage_expense/${userid}/`);
            if (!r.ok) throw new Error(`Failed to fetch (${r.status})`);
            const data = await r.json();
            const normalized = Array.isArray(data)
                ? data.map((it) => ({ ...it, ExpenseDate: (it.ExpenseDate || "").split("T")[0] }))
                : [];
            setExpenses(normalized);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (expense) => {
        setEditExpense({ ...expense });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditExpense((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        if (!editExpense) return;
        if (!editExpense.ExpenseItem || editExpense.ExpenseItem.trim() === "") {
            toast.error("Expense item is required");
            return;
        }
        if (editExpense.ExpenseCost === "" || editExpense.ExpenseCost == null) {
            toast.error("Expense cost is required");
            return;
        }

        setSaving(true);
        const payload = {
            UserId: Number(userid),
            ExpenseDate: editExpense.ExpenseDate,
            ExpenseItem: editExpense.ExpenseItem,
            ExpenseCost: editExpense.ExpenseCost,
        };

        try {
            const r = await fetch(`http://127.0.0.1:8000/api/edit_expense/${editExpense.id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!r.ok) {
                const err = await r.json().catch(() => ({}));
                throw new Error(err.error || `Save failed (${r.status})`);
            }

            setExpenses((prev) => prev.map((it) => (it.id === editExpense.id ? { ...it, ...payload } : it)));
            toast.success("Expense updated.");
            setEditExpense(null);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (expenseId) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        setDeletingId(expenseId);
        try {
            const r = await fetch(`http://127.0.0.1:8000/api/edit_expense/${expenseId}/`, {
                method: "DELETE",
            });
            if (!r.ok) {
                const err = await r.json().catch(() => ({}));
                throw new Error(err.error || `Delete failed (${r.status})`);
            }
            setExpenses((prev) => prev.filter((it) => it.id !== expenseId));
            toast.success("Expense deleted.");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to delete");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer position="top-right" />
            <div className="text-center mb-4">
                <h2>
                    <i className="fas fa-tasks me-2" /> Manage Expense
                </h2>
                <p className="text-muted">View, Edit or Delete</p>
            </div>

            <div>
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Item</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : expenses.length > 0 ? (
                            expenses.map((expense, index) => (
                                <tr key={expense.id}>
                                    <td>{index + 1}</td>
                                    <td>{expense.ExpenseDate || "-"}</td>
                                    <td>{expense.ExpenseItem}</td>
                                    <td>{expense.ExpenseCost}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(expense)}>
                                            <i className="fas fa-edit" /> Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(expense.id)}
                                            disabled={deletingId === expense.id}
                                        >
                                            {deletingId === expense.id ? "Deleting..." : <><i className="fas fa-trash" /> Delete</>}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <i className="fas fa-exclamation-circle me-2" /> No expenses found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editExpense && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    <i className="fas fa-pen me-2" /> Edit Expense
                                </h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setEditExpense(null)} />
                            </div>

                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Expense Date</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fa fa-calendar" />
                                        </span>
                                        <input
                                            type="date"
                                            name="ExpenseDate"
                                            className="form-control"
                                            onChange={handleChange}
                                            value={editExpense.ExpenseDate ?? ""}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Expense Item</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-shopping-cart" />
                                        </span>
                                        <input
                                            type="text"
                                            name="ExpenseItem"
                                            className="form-control"
                                            placeholder="Enter expense item (e.g. Groceries, Petrol )"
                                            onChange={handleChange}
                                            value={editExpense.ExpenseItem ?? ""}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Expense Cost (₹)</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-rupee-sign" />
                                        </span>
                                        <input
                                            type="text"
                                            name="ExpenseCost"
                                            className="form-control"
                                            placeholder="Enter Amount"
                                            onChange={handleChange}
                                            value={editExpense.ExpenseCost ?? ""}
                                        />
                                    </div>
                                </div>

                                <button type="button" className="btn btn-primary w-100 mt-3" onClick={handleSaveChanges} disabled={saving}>
                                    {saving ? "Saving..." : <><i className="fas fa-save me-2" /> Save Expense</>}
                                </button>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setEditExpense(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageExpense;
