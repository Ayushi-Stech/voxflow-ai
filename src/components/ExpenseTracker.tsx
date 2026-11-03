import React, { useState } from 'react';
import { IndianRupee, PieChart, Plus, Trash2, Tag, ArrowUpRight, TrendingUp, Utensils, Car, Laptop, Receipt, HeartPulse, Briefcase, ShoppingBag } from 'lucide-react';
import { ExpenseItem } from '../types';

interface ExpenseTrackerProps {
  expenses: ExpenseItem[];
  onAddExpense: (expense: Omit<ExpenseItem, 'id' | 'timestamp'>) => void;
  onDeleteExpense: (id: string) => void;
  monthlyBudget: number;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
  monthlyBudget,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseItem['category']>('Food');

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const budgetPercentage = Math.min(100, Math.round((totalSpent / monthlyBudget) * 100));

  const getCategoryIcon = (cat: ExpenseItem['category']) => {
    switch (cat) {
      case 'Food': return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
      case 'Travel': return <Car className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Tech': return <Laptop className="w-3.5 h-3.5 text-violet-400" />;
      case 'Bills': return <Receipt className="w-3.5 h-3.5 text-rose-400" />;
      case 'Health': return <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Office': return <Briefcase className="w-3.5 h-3.5 text-blue-400" />;
      case 'Shopping': return <ShoppingBag className="w-3.5 h-3.5 text-fuchsia-400" />;
      default: return <Tag className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || !description.trim()) return;

    onAddExpense({
      amount: parsedAmount,
      currency: 'INR',
      category,
      description: description.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });

    setAmount('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between pb-3.5 border-b border-slate-800/80 gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-sm font-bold text-white whitespace-nowrap">
                Expense Ledger
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 whitespace-nowrap shrink-0">
                Action 1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">Automated Voice Financial Tracking</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition shrink-0 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Manual Add</span>
        </button>
      </div>

      {/* Financial Metrics Summary Card */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800/80">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Logged Spend</span>
            <div className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-1 mt-0.5">
              <span>₹{totalSpent.toLocaleString('en-IN')}</span>
              <TrendingUp className="w-4 h-4 text-emerald-400 ml-1 inline" />
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-slate-400">Monthly Cap</span>
            <div className="text-sm font-bold text-slate-300 mt-0.5">
              ₹{monthlyBudget.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Budget bar */}
        <div className="mt-2">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Budget Utilized</span>
            <span className={budgetPercentage > 85 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-medium'}>
              {budgetPercentage}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                budgetPercentage > 85
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Manual add input form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mt-3 p-3 rounded-xl bg-slate-900/95 border border-slate-700/80 space-y-2.5 animate-fadeIn">
          <div className="text-xs font-semibold text-slate-300">Add Expense Entry</div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Tech">Tech</option>
              <option value="Bills">Bills</option>
              <option value="Health">Health</option>
              <option value="Office">Office</option>
              <option value="Shopping">Shopping</option>
              <option value="General">General</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Description (e.g. Lunch with team)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
            required
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg"
            >
              Save Expense
            </button>
          </div>
        </form>
      )}

      {/* Expenses List */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[310px]">
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No expenses logged yet. Try saying: "Spent 250 rupees on lunch"
          </div>
        ) : (
          expenses.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {item.description}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 ml-2">
                <span className="text-xs font-bold text-amber-400">
                  ₹{item.amount.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => onDeleteExpense(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition"
                  title="Delete entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

