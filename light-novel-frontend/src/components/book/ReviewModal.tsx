'use client';

import { useState } from 'react';
import apiService from '@/services/api';
import toast from 'react-hot-toast';

interface Props {
  bookId: number;
  onSuccess?: () => void;
}

export default function ReviewModal({
  bookId,
  onSuccess,
}: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReview = async () => {
    try {
      await apiService.reviews.create(
        bookId,
        rating,
        comment
      );

      toast.success('Đánh giá thành công');

      onSuccess?.();
    } catch {
      toast.error('Không thể gửi đánh giá');
    }
  };

  return (
    <dialog
      id={`review-${bookId}`}
      className="modal"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Đánh giá sản phẩm
        </h3>

        <div className="mt-4">
          <select
            className="select select-bordered w-full"
            value={rating}
            onChange={(e) =>
              setRating(Number(e.target.value))
            }
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <option
                key={star}
                value={star}
              >
                {star} sao
              </option>
            ))}
          </select>
        </div>

        <textarea
          className="textarea textarea-bordered w-full mt-4"
          rows={4}
          placeholder="Nhận xét của bạn..."
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
        />

        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={submitReview}
          >
            Gửi đánh giá
          </button>

          <form method="dialog">
            <button className="btn">
              Đóng
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}